// Campori — versão simples (Cloudflare Worker + D1)
const VERSAO = '4.6';

const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const hoje = () => new Date(Date.now() + 3600e3).toISOString().slice(0, 10); // hora de Angola
const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const rnd = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const tel = (t) => (t || '').replace(/\D/g, '').replace(/^244/, '') || null;
const mail = (e) => (e || '').trim().toLowerCase() || null;
class E extends Error { constructor(m, s = 400) { super(m); this.s = s; } }

async function hash(senha, salt) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 100000 }, k, 256));
}

const ITENS_BASE = ['Tenda', 'Saco-cama ou colchão', 'Prato, caneca e talheres', 'Lanterna', 'Rede mosquiteira', 'Repelente', 'Garrafa de água', 'Uniforme de gala', 'Uniforme de campo', 'Capa de chuva'];
const ASS = '\n\n{director}\nClube {clube}';
const MODELOS_BASE = [
  ['Pagamento em falta', 'deve', 'Saudações, prezado(a) {encarregado}.\n\nFaltam {dias_transporte} dias para o fim dos pagamentos do Campori ({prazo_transporte}). Temos registado para {nome}:\n\n✅ Pago: {pago}\n⏳ Em falta: {falta}\n💰 Total em falta: {total_falta}\n\nSe já pagou, pedimos que nos envie o comprovativo. Caso contrário, solicitamos que o faça com a maior brevidade possível. Se houver alguma dificuldade, fale connosco para encontrarmos juntos uma solução.' + ASS],
  ['Documentos em falta', 'docs', 'Saudações, prezado(a) {encarregado}.\n\nPara que {nome} possa participar no Campori, ainda nos falta: {docs_falta}.\n\nPedimos que nos entregue com a maior brevidade possível. Qualquer dúvida, estamos à disposição.' + ASS],
  ['Material em falta', 'material', 'Saudações, prezado(a) {encarregado}.\n\nSegundo o nosso registo, {nome} ainda não tem: {material_falta}.\n\nSe já tem algum destes itens, avise-nos para actualizarmos a lista. Se houver dificuldade em arranjar algum, fale connosco: o clube pode ajudar.' + ASS],
  ['Informação da partida', 'todos', 'Saudações, prezado(a) {encarregado}.\n\nA partida para o Campori é no dia {data_partida}.\n📍 Local de embarque: [escreva aqui]\n🕕 Hora: [escreva aqui]\n\n{nome} deve trazer o uniforme de gala, a mochila com o material e a garrafa de água cheia.' + ASS],
  ['Aviso geral', 'todos', 'Saudações, prezados pais e encarregados.\n\n[Escreva aqui o aviso]' + ASS],
];
async function iniciar(DB, c) {
  if (c.iniciado) return;
  await DB.batch([DB.prepare('UPDATE clubes SET iniciado=1 WHERE id=?').bind(c.id), ...ITENS_BASE.map((n) => DB.prepare('INSERT INTO itens (clube_id,nome) VALUES (?,?)').bind(c.id, n)),
    ...MODELOS_BASE.map(([t, f, x]) => DB.prepare('INSERT INTO modelos (clube_id,titulo,filtro,texto) VALUES (?,?,?,?)').bind(c.id, t, f, x))]);
}

// ---- participantes: só a Missão inclui ou retira (inscrições fechadas) ----
const catDe = (x) => (/^(desbravador|aventureiro|dbv)?$/i.test(String(x || '').trim()) ? 'Desbravador' : 'Direção');
const dataISO = (x) => { x = String(x || '').trim(); let m = x.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/); if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`; m = x.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[0] : ''; };
const limpaNome = (x) => String(x || '').trim().replace(/\s+/g, ' ').slice(0, 120);
const insParticipante = (DB, cid, l) => DB.prepare('INSERT INTO participantes (clube_id,nome,categoria,nascimento,encarregado,telefone,obs) VALUES (?,?,?,?,?,?,?)')
  .bind(cid, limpaNome(l.nome), l.categoria === 'Direção' || l.categoria === 'Desbravador' ? l.categoria : catDe(l.categoria), dataISO(l.nascimento), String(l.encarregado || '').trim().slice(0, 120), String(l.telefone || '').replace(/[^\d+ ]/g, '').trim().slice(0, 20), String(l.obs || '').trim().slice(0, 300));
const delParticipante = (DB, cid, pid) => [
  DB.prepare('DELETE FROM contrib_pagas WHERE participante_id IN (SELECT id FROM participantes WHERE id=? AND clube_id=?)').bind(pid, cid),
  DB.prepare('DELETE FROM itens_tem WHERE participante_id IN (SELECT id FROM participantes WHERE id=? AND clube_id=?)').bind(pid, cid),
  DB.prepare('DELETE FROM envios WHERE participante_id=? AND clube_id=?').bind(pid, cid),
  DB.prepare('DELETE FROM fichas WHERE participante_id=? AND clube_id=?').bind(pid, cid),
  DB.prepare('DELETE FROM participantes WHERE id=? AND clube_id=?').bind(pid, cid)];

// ---- campos da ficha individual ----
const FICHA_CAMPOS = ['nascimento', 'sexo', 'morada', 'escola_classe', 'enc_nome', 'enc_parentesco', 'enc_tel', 'enc_tel2', 'emerg_nome', 'emerg_tel',
  'tipo_sangue', 'alergias', 'medicacao', 'condicoes', 'restricoes_alim', 'sabe_nadar', 'obs_saude',
  'autoriza_tratamento', 'autoriza_imagem', 'autorizacao_entregue', 'ficha_entregue', 'data_entrega', 'recebido_por'];
const FICHA_OBRIG_DBV = ['nascimento', 'enc_nome', 'enc_tel', 'tipo_sangue', 'alergias', 'medicacao', 'condicoes', 'autoriza_tratamento'];
const FICHA_OBRIG_DIR = ['emerg_nome', 'emerg_tel', 'tipo_sangue', 'alergias', 'medicacao', 'condicoes'];

// número oficial de inscritos do clube, acertado sozinho:
// - depois de incluir: se o clube passar a ter mais nomes do que o oficial, é inscrição nova → oficial = nº de nomes
// - depois de retirar: o oficial desce 1 (a pessoa já não vai)
const sobeOficial = (DB, cid) => DB.prepare('UPDATE clubes SET inscritos_oficial = MAX(inscritos_oficial, (SELECT COUNT(*) FROM participantes WHERE clube_id=?)) WHERE id=? AND inscritos_oficial IS NOT NULL').bind(cid, cid);
const desceOficial = (DB, cid) => DB.prepare('UPDATE clubes SET inscritos_oficial = MAX(0, inscritos_oficial - 1) WHERE id=? AND inscritos_oficial IS NOT NULL').bind(cid);

const PRAZO = `date(?, printf('%+d days', -m.dias_antes))`;

async function metricas(DB, ids) {
  if (!ids.length) return {};
  if (ids.length > 80) { // o D1 aceita no máximo 100 valores por consulta: calcular em blocos
    const out = {};
    for (let i = 0; i < ids.length; i += 80) Object.assign(out, await metricas(DB, ids.slice(i, i + 80)));
    return out;
  }
  const ev = await DB.prepare('SELECT * FROM evento WHERE id=1').first();
  const q = ids.map(() => '?').join(','), d = hoje();
  const VAL = `CASE WHEN p.categoria='Desbravador' THEN k.valor_dbv ELSE k.valor_dir END`;
  const [p, t, e1, e2, i1, i2, fc] = await DB.batch([
    DB.prepare(`SELECT clube_id, COUNT(*) n, SUM(categoria='Desbravador') dbv, SUM(categoria<>'Desbravador') dir,
      SUM(pago_inscricao AND pago_transporte AND
        (SELECT COUNT(*) FROM contribuicoes k WHERE k.clube_id=p.clube_id AND ${VAL}>0) =
        (SELECT COUNT(*) FROM contrib_pagas x JOIN contribuicoes k ON k.id=x.contribuicao_id WHERE x.participante_id=p.id AND ${VAL}>0)) pagos,
      SUM(pago_inscricao * CASE WHEN categoria='Desbravador' THEN ? ELSE ? END + pago_transporte * ?) recebido,
      SUM(categoria='Desbravador' AND autorizacao=0) sem_aut, SUM(ficha_medica=0) sem_ficha
      FROM participantes p WHERE clube_id IN (${q}) GROUP BY clube_id`).bind(ev.taxa_dbv, ev.taxa_dir, ev.transporte, ...ids),
    DB.prepare(`SELECT c.id clube_id, COUNT(*) total, SUM(COALESCE(t.feita,0)) feitas,
      SUM(COALESCE(t.feita,0)=0 AND ${PRAZO} < ?) atrasadas
      FROM clubes c CROSS JOIN tarefa_modelo m LEFT JOIN tarefas t ON t.clube_id=c.id AND t.ordem=m.ordem
      WHERE c.id IN (${q}) GROUP BY c.id`).bind(ev.inicio, d, ...ids),
    DB.prepare(`SELECT k.clube_id, SUM(${VAL}) devido_extra FROM contribuicoes k JOIN participantes p ON p.clube_id=k.clube_id WHERE k.clube_id IN (${q}) GROUP BY k.clube_id`).bind(...ids),
    DB.prepare(`SELECT p.clube_id, SUM(${VAL}) recebido_extra FROM contrib_pagas x JOIN participantes p ON p.id=x.participante_id JOIN contribuicoes k ON k.id=x.contribuicao_id WHERE p.clube_id IN (${q}) GROUP BY p.clube_id`).bind(...ids),
    DB.prepare(`SELECT clube_id, COUNT(*) itens FROM itens WHERE clube_id IN (${q}) GROUP BY clube_id`).bind(...ids),
    DB.prepare(`SELECT p.clube_id, COUNT(*) tem FROM itens_tem t JOIN participantes p ON p.id=t.participante_id JOIN itens i ON i.id=t.item_id WHERE p.clube_id IN (${q}) GROUP BY p.clube_id`).bind(...ids),
    DB.prepare(`SELECT p.clube_id, COUNT(*) fichas FROM fichas f JOIN participantes p ON p.id=f.participante_id WHERE f.completa=1 AND p.clube_id IN (${q}) GROUP BY p.clube_id`).bind(...ids),
  ]);
  const out = {};
  for (const id of ids) out[id] = { n: 0, dbv: 0, dir: 0, pagos: 0, recebido: 0, sem_aut: 0, sem_ficha: 0, total: 0, feitas: 0, atrasadas: 0, devido_extra: 0, recebido_extra: 0, itens: 0, tem: 0, fichas: 0 };
  for (const r of [p, t, e1, e2, i1, i2, fc].flatMap((x) => x.results)) for (const [k, v] of Object.entries(r)) out[r.clube_id][k] = v ?? 0;
  for (const id of ids) {
    const o = out[id];
    o.devido = o.dbv * ev.taxa_dbv + o.dir * ev.taxa_dir + o.n * ev.transporte + o.devido_extra;
    o.recebido += o.recebido_extra;
    o.pct_material = o.n && o.itens ? Math.round((o.tem / (o.n * o.itens)) * 100) : 0;
    o.pct_pago = o.devido ? Math.round((o.recebido / o.devido) * 100) : 0;
    const a = [];
    if (!o.n) a.push('Sem acampantes registados');
    else if (!o.dir) a.push('Sem adultos inscritos');
    else if (o.dbv / o.dir > ev.racio_max) a.push(`Mais de ${ev.racio_max} desbravadores por adulto`);
    if (o.atrasadas) a.push(`${o.atrasadas} tarefa(s) atrasada(s)`);
    if (d > ev.prazo_cobranca && o.n && o.pagos < o.n) a.push(`${o.n - o.pagos} por pagar`);
    if (d > ev.prazo_cobranca && o.sem_aut) a.push(`${o.sem_aut} sem autorização`);
    o.alertas = a;
  }
  return out;
}

async function criarConta(DB, b) {
  const email = mail(b.email), t = tel(b.telefone);
  if (!b.nome) throw new E('Indique o nome');
  if (!email && !t) throw new E('Indique telefone ou e-mail');
  if (t && !/^9\d{8}$/.test(t)) throw new E('Telefone inválido (9 dígitos, começa por 9)');
  const senha = b.senha || rnd(3), salt = rnd(16);
  try {
    await DB.prepare('INSERT INTO utilizadores (nome,email,telefone,senha_hash,salt,papel,regiao_id,clube_id,trocar_senha,funcao) VALUES (?,?,?,?,?,?,?,?,?,?)')
      .bind(b.nome.trim(), email, t, await hash(senha, salt), salt, b.papel, b.regiao_id || null, b.clube_id || null, b.trocar ?? 1, b.funcao === 'secretario' ? 'secretario' : 'director').run();
  } catch (e) { if (String(e).includes('UNIQUE')) throw new E('Já existe uma conta com esse telefone ou e-mail'); throw e; }
  return { login: email || t, senha };
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    try { return await api(req, env.DB, url); }
    catch (e) { return json({ erro: e instanceof E ? e.message : 'Erro interno: ' + e.message }, e.s || 500); }
  },
};

async function api(req, DB, url) {
  const p = url.pathname.split('/').slice(2).filter(Boolean), M = req.method;
  const body = async () => { try { return await req.json(); } catch { return {}; } };

  if (p[0] === 'ping') return json({ ok: true, versao: VERSAO, hoje: hoje() });
  if (p[0] === 'estado') return json({ configurado: (await DB.prepare('SELECT COUNT(*) n FROM utilizadores').first()).n > 0 });
  if (p[0] === 'setup' && M === 'POST') {
    if ((await DB.prepare('SELECT COUNT(*) n FROM utilizadores').first()).n) throw new E('Já configurado', 403);
    await criarConta(DB, { ...(await body()), papel: 'missao', trocar: 0 });
    return json({ ok: true });
  }
  if (p[0] === 'login' && M === 'POST') {
    const b = await body();
    const u = await DB.prepare('SELECT * FROM utilizadores WHERE (email=? OR telefone=?) AND ativo=1').bind(mail(b.login), tel(b.login)).first();
    if (!u || (await hash(b.senha || '', u.salt)) !== u.senha_hash) { await new Promise((r) => setTimeout(r, 600)); throw new E('Login ou senha incorrectos', 401); }
    const token = rnd(32);
    await DB.prepare("INSERT INTO sessoes VALUES (?,?,datetime('now','+30 days'))").bind(token, u.id).run();
    return json({ token });
  }

  const tk = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const u = tk && await DB.prepare(`SELECT u.* FROM sessoes s JOIN utilizadores u ON u.id=s.user_id WHERE s.token=? AND s.expira>datetime('now') AND u.ativo=1`).bind(tk).first();
  if (!u) throw new E('Sessão expirada. Entre novamente.', 401);
  const missao = u.papel === 'missao';

  if (p[0] === 'logout') { await DB.prepare('DELETE FROM sessoes WHERE token=?').bind(tk).run(); return json({ ok: true }); }
  if (p[0] === 'me' && M === 'GET') {
    const [ev, cl, rg] = await Promise.all([DB.prepare('SELECT * FROM evento WHERE id=1').first(),
      DB.prepare('SELECT c.*, r.nome regiao FROM clubes c JOIN regioes r ON r.id=c.regiao_id WHERE c.id=?').bind(u.clube_id).first(),
      DB.prepare('SELECT * FROM regioes WHERE id=?').bind(u.regiao_id).first()]);
    return json({ user: { id: u.id, nome: u.nome, papel: u.papel, clube_id: u.clube_id, regiao_id: u.regiao_id, trocar_senha: u.trocar_senha, login: u.email || u.telefone, funcao: u.funcao || 'director' }, clube: cl, regiao: rg, evento: ev, hoje: hoje() });
  }
  if (p[0] === 'me' && p[1] === 'senha' && M === 'POST') {
    const b = await body();
    if ((await hash(b.atual || '', u.salt)) !== u.senha_hash) throw new E('Senha actual incorrecta');
    if (!b.nova || b.nova.length < 6) throw new E('A nova senha precisa de pelo menos 6 caracteres');
    const salt = rnd(16);
    await DB.prepare('UPDATE utilizadores SET senha_hash=?, salt=?, trocar_senha=0 WHERE id=?').bind(await hash(b.nova, salt), salt, u.id).run();
    return json({ ok: true });
  }

  // procurar pessoas (lupa do topo, Regional / Missão)
  if (p[0] === 'procurar') {
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    const q = String(url.searchParams.get('q') || '').trim();
    if (q.length < 2) return json([]);
    const w = u.papel === 'regional' ? 'AND c.regiao_id=' + +u.regiao_id : '';
    return json((await DB.prepare(`SELECT p.id, p.nome, p.categoria, c.id clube_id, c.nome clube, r.nome regiao FROM participantes p JOIN clubes c ON c.id=p.clube_id JOIN regioes r ON r.id=c.regiao_id
      WHERE p.nome LIKE ? ${w} ORDER BY p.nome LIMIT 30`).bind('%' + q.replace(/[%_]/g, '') + '%').all()).results);
  }
  if (p[0] === 'regioes') return json((await DB.prepare('SELECT * FROM regioes ORDER BY nome').all()).results);

  if (p[0] === 'clubes') {
    const w = u.papel === 'regional' ? 'WHERE c.regiao_id=' + +u.regiao_id : u.papel === 'director' ? 'WHERE c.id=' + +u.clube_id : '';
    return json((await DB.prepare(`SELECT c.id, c.nome, c.igreja, c.regiao_id, r.nome regiao, c.contacto_nome, c.contacto_tel FROM clubes c JOIN regioes r ON r.id=c.regiao_id ${w} ORDER BY r.nome, c.nome`).all()).results);
  }

  // Visão geral (Regional / Missão)
  if (p[0] === 'visao') {
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    const w = u.papel === 'regional' ? 'WHERE c.regiao_id=' + +u.regiao_id : '';
    const cl = (await DB.prepare(`SELECT c.id, c.nome, c.regiao_id, c.inscritos_oficial, c.contacto_nome, c.contacto_tel, r.nome regiao, d.id dir_id, d.nome dir_nome, d.telefone dir_tel, d.email dir_email, COALESCE(d.nome, c.contacto_nome) ct_nome, COALESCE(d.telefone, c.contacto_tel) ct_tel
      FROM clubes c JOIN regioes r ON r.id=c.regiao_id LEFT JOIN utilizadores d ON d.clube_id=c.id AND d.papel='director' AND COALESCE(d.funcao,'director')='director' AND d.ativo=1 ${w} GROUP BY c.id ORDER BY r.nome, c.nome`).all()).results;
    const m = await metricas(DB, cl.map((c) => c.id));
    const pend = Object.fromEntries((await DB.prepare("SELECT clube_id, COUNT(*) n FROM pedidos WHERE estado='pendente' GROUP BY clube_id").all()).results.map((r) => [r.clube_id, r.n]));
    return json(cl.map((c) => ({ ...c, ...m[c.id], pedidos: pend[c.id] || 0 })));
  }

  // ---- pedidos de inclusão/retirada ----
  if (p[0] === 'pedidos') {
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    if (M === 'GET') {
      const w = u.papel === 'regional' ? 'AND c.regiao_id=' + +u.regiao_id : '';
      return json((await DB.prepare(`SELECT x.*, c.nome clube, r.nome regiao, c.inscritos_oficial, (SELECT COUNT(*) FROM participantes p WHERE p.clube_id=c.id) com_nome FROM pedidos x JOIN clubes c ON c.id=x.clube_id JOIN regioes r ON r.id=c.regiao_id WHERE (x.estado='pendente' OR x.respondido_em > datetime('now','-6 days')) ${w} ORDER BY x.estado='pendente' DESC, x.id DESC LIMIT 200`).all()).results);
    }
    if (!missao) throw new E('Só a Missão responde a pedidos', 403);
    const x = await DB.prepare("SELECT * FROM pedidos WHERE id=? AND estado='pendente'").bind(+p[1]).first();
    if (!x) throw new E('Pedido não encontrado ou já respondido');
    const b = await body(), aceitar = b.acao === 'aceitar';
    const st = [DB.prepare("UPDATE pedidos SET estado=?, resposta=?, respondido_em=datetime('now','+1 hour') WHERE id=?").bind(aceitar ? 'aceite' : 'recusado', String(b.resposta || '').slice(0, 300), x.id)];
    if (aceitar && x.tipo === 'incluir') st.push(insParticipante(DB, x.clube_id, x), sobeOficial(DB, x.clube_id));
    if (aceitar && x.tipo === 'retirar') st.push(...delParticipante(DB, x.clube_id, x.participante_id), desceOficial(DB, x.clube_id));
    await DB.batch(st);
    return json({ ok: true });
  }

  // ---- DOCUMENTOS da Missão / Região para os clubes ----
  if (p[0] === 'documentos') {
    const PARTE = 524288, MAX = 20 * 1024 * 1024;
    const vis = (d) => missao || d.alvo === 'todos' || d.regiao_id === u.regiao_id;
    if (M === 'GET' && !p[1]) {
      const ls = (await DB.prepare('SELECT d.id, d.titulo, d.descricao, d.ficheiro, d.tipo, d.tamanho, d.partes, d.alvo, d.regiao_id, d.autor_id, d.autor_nome, d.criado_em, r.nome regiao FROM documentos d LEFT JOIN regioes r ON r.id=d.regiao_id WHERE d.completo=1 ORDER BY d.id DESC').all()).results;
      return json(ls.filter(vis));
    }
    const d = p[1] ? await DB.prepare('SELECT * FROM documentos WHERE id=?').bind(+p[1]).first() : null;
    if (p[1] && (!d || !vis(d))) throw new E('Documento não encontrado', 404);
    if (M === 'GET' && p[2] === 'parte') {
      const r = await DB.prepare('SELECT dados FROM documento_partes WHERE doc_id=? AND n=?').bind(d.id, +p[3]).first();
      if (!r) throw new E('Parte em falta', 404);
      const v = r.dados, bytes = v instanceof ArrayBuffer ? new Uint8Array(v) : Array.isArray(v) ? Uint8Array.from(v) : v;
      return new Response(bytes, { headers: { 'content-type': 'application/octet-stream', 'cache-control': 'private, max-age=86400' } });
    }
    if (u.papel === 'director') throw new E('Só a Missão e as Regiões publicam documentos', 403);
    if (M === 'POST' && !p[1]) {
      const b = await body(), titulo = String(b.titulo || '').trim().slice(0, 150), ficheiro = String(b.ficheiro || '').trim().slice(0, 150), tam = +b.tamanho || 0;
      if (!titulo || !ficheiro) throw new E('Indique o título e escolha o ficheiro');
      if (tam <= 0 || tam > MAX) throw new E('O ficheiro tem de ter até 20 MB');
      let alvo = b.alvo === 'regiao' ? 'regiao' : 'todos', rid = alvo === 'regiao' ? +b.regiao_id || null : null;
      if (u.papel === 'regional') { alvo = 'regiao'; rid = u.regiao_id; }
      if (alvo === 'regiao' && !rid) throw new E('Escolha a região');
      const r = await DB.prepare('INSERT INTO documentos (titulo,descricao,ficheiro,tipo,tamanho,partes,alvo,regiao_id,autor_id,autor_nome) VALUES (?,?,?,?,?,?,?,?,?,?)')
        .bind(titulo, String(b.descricao || '').slice(0, 500), ficheiro, String(b.tipo || 'application/octet-stream').slice(0, 100), tam, Math.ceil(tam / PARTE), alvo, rid, u.id, u.nome).run();
      return json({ id: r.meta.last_row_id, parte: PARTE });
    }
    if (!missao && d.autor_id !== u.id) throw new E('Só pode alterar os seus documentos', 403);
    if (M === 'PUT' && p[2] === 'parte') {
      const n = +p[3]; if (!(n >= 0 && n < d.partes)) throw new E('Parte inválida');
      const buf = new Uint8Array(await req.arrayBuffer()); if (!buf.length || buf.length > PARTE) throw new E('Parte com tamanho inválido');
      await DB.prepare('INSERT OR REPLACE INTO documento_partes (doc_id,n,dados) VALUES (?,?,?)').bind(d.id, n, buf).run();
      const c = await DB.prepare('SELECT COUNT(*) n FROM documento_partes WHERE doc_id=?').bind(d.id).first();
      if (c.n === d.partes) await DB.prepare('UPDATE documentos SET completo=1 WHERE id=?').bind(d.id).run();
      return json({ ok: true, completo: c.n === d.partes });
    }
    if (M === 'DELETE') { await DB.batch([DB.prepare('DELETE FROM documento_partes WHERE doc_id=?').bind(d.id), DB.prepare('DELETE FROM documentos WHERE id=?').bind(d.id)]); return json({ ok: true }); }
  }

  // ---- AVISOS aos directores (Missão / Região) ----
  if (p[0] === 'avisos') {
    if (M === 'GET') {
      if (u.papel === 'director') {
        return json((await DB.prepare(`SELECT a.*, (SELECT lido_em FROM avisos_lidos l WHERE l.aviso_id=a.id AND l.user_id=?) lido_em FROM avisos a
          WHERE a.alvo='todos' OR (a.alvo='regiao' AND a.regiao_id=?) OR (a.alvo='clube' AND a.clube_id=?) ORDER BY a.id DESC LIMIT 100`).bind(u.id, u.regiao_id, u.clube_id).all()).results);
      }
      const w = u.papel === 'regional' ? `WHERE a.alvo='todos' OR (a.alvo='regiao' AND a.regiao_id=${+u.regiao_id}) OR (a.alvo='clube' AND a.clube_id IN (SELECT id FROM clubes WHERE regiao_id=${+u.regiao_id}))` : '';
      const av = (await DB.prepare(`SELECT a.*, r.nome regiao, c.nome clube FROM avisos a LEFT JOIN regioes r ON r.id=a.regiao_id LEFT JOIN clubes c ON c.id=a.clube_id ${w} ORDER BY a.id DESC LIMIT 100`).all()).results;
      const dirs = (await DB.prepare("SELECT u.id, u.nome, u.telefone, u.regiao_id, u.clube_id, c.nome clube FROM utilizadores u JOIN clubes c ON c.id=u.clube_id WHERE u.papel='director' AND COALESCE(u.funcao,'director')='director' AND u.ativo=1").all()).results;
      const lidos = (await DB.prepare('SELECT aviso_id, user_id FROM avisos_lidos').all()).results;
      return json(av.map((a) => {
        let d = dirs.filter((x) => a.alvo === 'todos' || (a.alvo === 'regiao' && x.regiao_id === a.regiao_id) || (a.alvo === 'clube' && x.clube_id === a.clube_id));
        if (u.papel === 'regional') d = d.filter((x) => x.regiao_id === u.regiao_id);
        const L = new Set(lidos.filter((l) => l.aviso_id === a.id).map((l) => l.user_id));
        return { ...a, destinatarios: d.length, lidos: d.filter((x) => L.has(x.id)).length, por_ler: d.filter((x) => !L.has(x.id)).map((x) => ({ nome: x.nome, telefone: x.telefone, clube: x.clube })) };
      }));
    }
    if (M === 'POST' && p[2] === 'lido') { await DB.prepare('INSERT OR IGNORE INTO avisos_lidos (aviso_id,user_id) VALUES (?,?)').bind(+p[1], u.id).run(); return json({ ok: true }); }
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    if (M === 'POST') {
      const b = await body(), titulo = String(b.titulo || '').trim().slice(0, 120), texto = String(b.texto || '').trim().slice(0, 3000);
      if (!titulo) throw new E('Indique o título');
      let alvo = ['todos', 'regiao', 'clube'].includes(b.alvo) ? b.alvo : 'todos', rid = null, cid = null;
      if (alvo === 'clube') { const c = await DB.prepare('SELECT * FROM clubes WHERE id=?').bind(+b.clube_id).first(); if (!c) throw new E('Escolha o clube'); cid = c.id; rid = c.regiao_id; }
      if (alvo === 'regiao') { rid = +b.regiao_id; if (!rid) throw new E('Escolha a região'); }
      if (u.papel === 'regional') { if (alvo === 'todos') { alvo = 'regiao'; rid = u.regiao_id; } if (rid !== u.regiao_id) throw new E('Só pode enviar para a sua região', 403); }
      await DB.prepare('INSERT INTO avisos (autor_id,autor_nome,alvo,regiao_id,clube_id,titulo,texto) VALUES (?,?,?,?,?,?,?)').bind(u.id, u.nome, alvo, rid, cid, titulo, texto).run();
      return json({ ok: true });
    }
    if (M === 'DELETE') {
      const a = await DB.prepare('SELECT * FROM avisos WHERE id=?').bind(+p[1]).first();
      if (!a) throw new E('Aviso não encontrado', 404);
      if (!missao && a.autor_id !== u.id) throw new E('Só pode apagar os seus avisos', 403);
      await DB.batch([DB.prepare('DELETE FROM avisos_lidos WHERE aviso_id=?').bind(a.id), DB.prepare('DELETE FROM avisos WHERE id=?').bind(a.id)]);
      return json({ ok: true });
    }
  }

  // ---- SECRETARIA: casos a seguir (Missão gere; Regional consulta a sua região) ----
  if (p[0] === 'secretaria' || p[0] === 'casos') {
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    const wr = u.papel === 'regional' ? 'WHERE c.regiao_id=' + +u.regiao_id : '';
    if (p[0] === 'secretaria' && M === 'GET') {
      const cl = (await DB.prepare(`SELECT c.id, c.nome, c.inscritos_oficial, c.regiao_id, r.nome regiao, d.id dir_id, COALESCE(d.nome, c.contacto_nome) dir_nome, COALESCE(d.telefone, c.contacto_tel) dir_tel FROM clubes c JOIN regioes r ON r.id=c.regiao_id
        LEFT JOIN utilizadores d ON d.clube_id=c.id AND d.papel='director' AND COALESCE(d.funcao,'director')='director' AND d.ativo=1 ${wr} GROUP BY c.id`).all()).results;
      const m = await metricas(DB, cl.map((c) => c.id));
      const avent = Object.fromEntries((await DB.prepare("SELECT clube_id, COUNT(*) n FROM participantes WHERE obs LIKE '%Aventureiro%' GROUP BY clube_id").all()).results.map((r) => [r.clube_id, r.n]));
      const pend = Object.fromEntries((await DB.prepare("SELECT clube_id, COUNT(*) n FROM pedidos WHERE estado='pendente' GROUP BY clube_id").all()).results.map((r) => [r.clube_id, r.n]));
      const casos = (await DB.prepare(`SELECT k.*, c.nome clube, r.nome regiao, c.regiao_id, (SELECT COUNT(*) FROM caso_notas n WHERE n.caso_id=k.id) notas
        FROM casos k LEFT JOIN clubes c ON c.id=k.clube_id LEFT JOIN regioes r ON r.id=c.regiao_id ${wr ? wr.replace('WHERE', 'WHERE (') + ' OR k.clube_id IS NULL)' : ''}
        ${wr ? 'AND' : 'WHERE'} (k.estado<>'Resolvido' OR k.resolvido_em > datetime('now','-14 days')) ORDER BY k.estado='Resolvido', k.prioridade='Alta' DESC, k.id DESC`).all()).results;
      const abertos = new Set(casos.filter((k) => k.estado !== 'Resolvido').map((k) => k.clube_id + '|' + k.tipo));
      const sug = [];
      const add = (c, tipo, titulo, prioridade) => { if (!abertos.has(c.id + '|' + tipo)) sug.push({ clube_id: c.id, clube: c.nome, regiao: c.regiao, dir_nome: c.dir_nome, dir_tel: c.dir_tel, tipo, titulo, prioridade }); };
      for (const c of cl) {
        const x = m[c.id];
        if (c.inscritos_oficial != null && x.n < c.inscritos_oficial) add(c, 'lista', x.n ? `Lista incompleta: faltam ${c.inscritos_oficial - x.n} nomes (oficial ${c.inscritos_oficial}, com nome ${x.n})` : `Sem lista nominal: ${c.inscritos_oficial} inscritos sem nomes`, 'Alta');
        if (c.inscritos_oficial != null && x.n > c.inscritos_oficial) add(c, 'lista', `Mais nomes do que inscritos oficiais (${x.n} para ${c.inscritos_oficial})`, 'Normal');
        if (x.n && !x.dir) add(c, 'adultos', `Sem adultos inscritos (${x.dbv} desbravadores)`, 'Alta');
        else if (x.dir && x.dbv / x.dir > 8) add(c, 'adultos', `Poucos adultos: ${x.dbv} desbravadores para ${x.dir} adultos`, 'Normal');
        if (!c.dir_id) add(c, 'acesso', 'Director ainda sem acesso à app', 'Normal');
        if (avent[c.id]) add(c, 'aventureiros', `${avent[c.id]} inscrito(s) como Aventureiro: confirmar se podem participar`, 'Normal');
        if (pend[c.id]) add(c, 'pedidos', `${pend[c.id]} pedido(s) de inclusão/retirada por responder`, 'Alta');
        if (x.alertas.some((a) => a.includes('por pagar'))) add(c, 'pagamentos', `${x.n - x.pagos} acampante(s) com pagamentos em falta após o prazo`, 'Alta');
      }
      const ordem = { Alta: 0, Normal: 1 };
      sug.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade] || a.regiao.localeCompare(b.regiao));
      return json({ casos, sugestoes: sug, oficiais: cl.filter((c) => c.inscritos_oficial != null).length, clubes: cl.length });
    }
    if (p[0] === 'casos') {
      if (M === 'GET' && p[1]) {
        const k = await DB.prepare(`SELECT k.*, c.nome clube, c.regiao_id, r.nome regiao, COALESCE(d.nome, c.contacto_nome) dir_nome, COALESCE(d.telefone, c.contacto_tel) dir_tel FROM casos k LEFT JOIN clubes c ON c.id=k.clube_id LEFT JOIN regioes r ON r.id=c.regiao_id
          LEFT JOIN utilizadores d ON d.clube_id=c.id AND d.papel='director' AND COALESCE(d.funcao,'director')='director' AND d.ativo=1 WHERE k.id=?`).bind(+p[1]).first();
        if (!k || (u.papel === 'regional' && k.regiao_id !== u.regiao_id)) throw new E('Caso não encontrado', 404);
        return json({ ...k, notas: (await DB.prepare('SELECT * FROM caso_notas WHERE caso_id=? ORDER BY id').bind(k.id).all()).results });
      }
      if (!missao) throw new E('Só a Secretaria da Missão altera os casos', 403);
      const b = await body();
      if (M === 'POST' && !p[1]) {
        const titulo = String(b.titulo || '').trim().slice(0, 200); if (!titulo) throw new E('Indique o assunto');
        const r = await DB.prepare('INSERT INTO casos (clube_id,tipo,titulo,descricao,prioridade,responsavel) VALUES (?,?,?,?,?,?)')
          .bind(b.clube_id ? +b.clube_id : null, String(b.tipo || 'outro').slice(0, 30), titulo, String(b.descricao || '').slice(0, 2000), b.prioridade === 'Alta' ? 'Alta' : 'Normal', String(b.responsavel || '').slice(0, 80)).run();
        return json({ id: r.meta.last_row_id });
      }
      if (M === 'POST' && p[2] === 'notas') {
        const t = String(b.texto || '').trim().slice(0, 2000); if (!t) throw new E('Escreva a nota');
        await DB.batch([DB.prepare('INSERT INTO caso_notas (caso_id,autor,texto) VALUES (?,?,?)').bind(+p[1], u.nome, t), DB.prepare("UPDATE casos SET atualizado_em=datetime('now','+1 hour') WHERE id=?").bind(+p[1])]);
        return json({ ok: true });
      }
      if (M === 'PUT') {
        const k = await DB.prepare('SELECT * FROM casos WHERE id=?').bind(+p[1]).first(); if (!k) throw new E('Caso não encontrado', 404);
        const estado = ['Aberto', 'Em curso', 'Resolvido'].includes(b.estado) ? b.estado : k.estado;
        const st = [DB.prepare(`UPDATE casos SET estado=?, prioridade=?, responsavel=?, atualizado_em=datetime('now','+1 hour'), resolvido_em=${estado === 'Resolvido' ? "COALESCE(resolvido_em, datetime('now','+1 hour'))" : 'NULL'} WHERE id=?`)
          .bind(estado, b.prioridade === 'Alta' || b.prioridade === 'Normal' ? b.prioridade : k.prioridade, b.responsavel !== undefined ? String(b.responsavel).slice(0, 80) : k.responsavel, k.id)];
        if (estado !== k.estado) st.push(DB.prepare('INSERT INTO caso_notas (caso_id,autor,texto) VALUES (?,?,?)').bind(k.id, u.nome, `Estado: ${k.estado} → ${estado}`));
        await DB.batch(st); return json({ ok: true });
      }
      if (M === 'DELETE') { await DB.batch([DB.prepare('DELETE FROM caso_notas WHERE caso_id=?').bind(+p[1]), DB.prepare('DELETE FROM casos WHERE id=?').bind(+p[1])]); return json({ ok: true }); }
    }
  }

  // ---- contacto do director de cada clube ----
  if (p[0] === 'contacto' && M === 'PUT') {
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    const c = await DB.prepare('SELECT * FROM clubes WHERE id=?').bind(+p[1]).first();
    if (!c || (u.papel === 'regional' && c.regiao_id !== u.regiao_id)) throw new E('Clube não encontrado', 404);
    const b = await body(), t = tel(b.telefone);
    if (t && !/^9\d{8}$/.test(t)) throw new E('Telefone inválido (9 dígitos, começa por 9)');
    await DB.prepare('UPDATE clubes SET contacto_nome=?, contacto_tel=? WHERE id=?').bind(String(b.nome || '').trim().slice(0, 120) || null, t, c.id).run();
    return json({ ok: true });
  }

  // ---- só Missão: contas e importação ----
  if (['importar', 'contas', 'importar-acampantes', 'importar-oficiais', 'importar-contactos'].includes(p[0]) && !missao) throw new E('Só a Missão', 403);
  if (p[0] === 'importar' && M === 'POST') {
    const regs = Object.fromEntries((await DB.prepare('SELECT * FROM regioes').all()).results.map((r) => [r.nome.toLowerCase(), r.id]));
    const res = { clubes: 0, acessos: [], erros: [] };
    for (const [i, l] of ((await body()).linhas || []).entries()) {
      const rid = regs[(l.regiao || '').trim().toLowerCase()];
      if (!rid || !l.clube) { res.erros.push(`Linha ${i + 2}: ${!rid ? `região "${l.regiao}" não existe` : 'falta o clube'}`); continue; }
      let c = await DB.prepare('SELECT id FROM clubes WHERE regiao_id=? AND nome=?').bind(rid, l.clube.trim()).first();
      if (!c) { c = { id: (await DB.prepare('INSERT INTO clubes (regiao_id,nome,igreja) VALUES (?,?,?)').bind(rid, l.clube.trim(), l.igreja || '').run()).meta.last_row_id }; res.clubes++; }
      if (l.director || l.telefone) await DB.prepare('UPDATE clubes SET contacto_nome=COALESCE(?, contacto_nome), contacto_tel=COALESCE(?, contacto_tel) WHERE id=?').bind(String(l.director || '').trim() || null, /^9\d{8}$/.test(tel(l.telefone) || '') ? tel(l.telefone) : null, c.id).run();
      if (l.director && (l.telefone || l.email)) {
        try { res.acessos.push({ nome: l.director, clube: l.clube, ...(await criarConta(DB, { nome: l.director, telefone: l.telefone, email: l.email, papel: 'director', clube_id: c.id, regiao_id: rid })) }); }
        catch (e) { res.erros.push(`Linha ${i + 2} (${l.director}): ${e.message}`); }
      }
    }
    return json(res);
  }
  // Lista nominal de todos os clubes (Região;Clube;Nome;Categoria;Nascimento…), enviada em blocos
  if (p[0] === 'importar-acampantes' && M === 'POST') {
    const regs = Object.fromEntries((await DB.prepare('SELECT * FROM regioes').all()).results.map((r) => [r.nome.toLowerCase(), r.id]));
    const clubes = {}; for (const c of (await DB.prepare('SELECT id, regiao_id, nome FROM clubes').all()).results) clubes[c.regiao_id + '|' + c.nome.toLowerCase()] = c.id;
    const ja = new Set((await DB.prepare('SELECT clube_id, nome FROM participantes').all()).results.map((r) => r.clube_id + '|' + r.nome.toLowerCase()));
    const res = { criados: 0, repetidos: 0, clubes_novos: 0, erros: [] }, st = [];
    for (const [i, l] of ((await body()).linhas || []).slice(0, 400).entries()) {
      const rid = regs[String(l.regiao || '').trim().toLowerCase()], cn = String(l.clube || '').trim(), nome = limpaNome(l.nome);
      if (!rid || !cn || !nome) { res.erros.push(`${l.linha || i + 2}: ${!rid ? `região "${l.regiao}" não existe` : !cn ? 'falta o clube' : 'falta o nome'}`); continue; }
      let cid = clubes[rid + '|' + cn.toLowerCase()];
      if (!cid) { cid = (await DB.prepare('INSERT INTO clubes (regiao_id,nome,igreja) VALUES (?,?,?)').bind(rid, cn, String(l.igreja || '').trim()).run()).meta.last_row_id; clubes[rid + '|' + cn.toLowerCase()] = cid; res.clubes_novos++; }
      const k = cid + '|' + nome.toLowerCase(); if (ja.has(k)) { res.repetidos++; continue; }
      ja.add(k); st.push(insParticipante(DB, cid, l)); res.criados++;
    }
    for (let i = 0; i < st.length; i += 100) await DB.batch(st.slice(i, i + 100));
    return json(res);
  }
  // Inscritos oficiais por clube (Região;Clube;Igreja;Inscritos) — cria os clubes que ainda não existem (ex.: sem lista)
  if (p[0] === 'importar-oficiais' && M === 'POST') {
    const regs = Object.fromEntries((await DB.prepare('SELECT * FROM regioes').all()).results.map((r) => [r.nome.toLowerCase(), r.id]));
    const res = { actualizados: 0, clubes_novos: 0, erros: [] };
    for (const [i, l] of ((await body()).linhas || []).slice(0, 400).entries()) {
      const rid = regs[String(l.regiao || '').trim().toLowerCase()], cn = String(l.clube || '').trim(), n = parseInt(String(l.inscritos).replace(/\D/g, ''), 10);
      if (!rid || !cn || isNaN(n)) { res.erros.push(`Linha ${i + 2}: ${!rid ? `região "${l.regiao}" não existe` : !cn ? 'falta o clube' : 'número inválido'}`); continue; }
      const c = await DB.prepare('SELECT id FROM clubes WHERE regiao_id=? AND nome=?').bind(rid, cn).first();
      if (c) { await DB.prepare('UPDATE clubes SET inscritos_oficial=? WHERE id=?').bind(n, c.id).run(); res.actualizados++; }
      else { await DB.prepare('INSERT INTO clubes (regiao_id,nome,igreja,inscritos_oficial) VALUES (?,?,?,?)').bind(rid, cn, String(l.igreja || '').trim(), n).run(); res.clubes_novos++; }
    }
    return json(res);
  }
  // Contactos dos directores (Região;Clube;Director;Telefone) — só actualiza clubes que já existem
  if (p[0] === 'importar-contactos' && M === 'POST') {
    const regs = Object.fromEntries((await DB.prepare('SELECT * FROM regioes').all()).results.map((r) => [r.nome.toLowerCase(), r.id]));
    const res = { actualizados: 0, erros: [] }, st = [];
    for (const [i, l] of ((await body()).linhas || []).slice(0, 400).entries()) {
      const rid = regs[String(l.regiao || '').trim().toLowerCase()], cn = String(l.clube || '').trim(), t = tel(l.telefone);
      if (!rid || !cn) { res.erros.push(`Linha ${i + 2}: ${!rid ? `região "${l.regiao}" não existe` : 'falta o clube'}`); continue; }
      if (t && !/^9\d{8}$/.test(t)) { res.erros.push(`Linha ${i + 2} (${cn}): telefone "${l.telefone}" inválido`); continue; }
      const c = await DB.prepare('SELECT id FROM clubes WHERE regiao_id=? AND nome=?').bind(rid, cn).first();
      if (!c) { res.erros.push(`Linha ${i + 2}: clube "${cn}" não existe na região ${l.regiao}`); continue; }
      st.push(DB.prepare('UPDATE clubes SET contacto_nome=COALESCE(?, contacto_nome), contacto_tel=COALESCE(?, contacto_tel) WHERE id=?').bind(String(l.director || '').trim() || null, t, c.id)); res.actualizados++;
    }
    for (let i = 0; i < st.length; i += 100) await DB.batch(st.slice(i, i + 100));
    return json(res);
  }
  if (p[0] === 'oficial' && M === 'PUT') {
    if (!missao) throw new E('Só a Missão', 403);
    const b = await body(), n = b.inscritos === '' || b.inscritos == null ? null : Math.max(0, parseInt(b.inscritos, 10) || 0);
    await DB.prepare('UPDATE clubes SET inscritos_oficial=? WHERE id=?').bind(n, +p[1]).run();
    return json({ ok: true });
  }
  if (p[0] === 'contas') {
    if (M === 'GET') {
      const pap = url.searchParams.get('papel') === 'missao' ? 'missao' : 'regional';
      return json((await DB.prepare(`SELECT u.id, u.nome, u.telefone, u.email, u.papel, r.nome regiao FROM utilizadores u LEFT JOIN regioes r ON r.id=u.regiao_id WHERE u.papel=? AND u.ativo=1 ORDER BY r.nome, u.nome`).bind(pap).all()).results);
    }
    if (M === 'POST' && !p[1]) {
      const b = await body();
      if (b.papel === 'regional' && !b.regiao_id) throw new E('Escolha a região');
      if (b.papel === 'director') {
        const c = await DB.prepare('SELECT * FROM clubes WHERE id=?').bind(+b.clube_id).first();
        if (!c) throw new E('Clube não encontrado');
        await DB.prepare("UPDATE utilizadores SET ativo=0 WHERE clube_id=? AND papel='director' AND COALESCE(funcao,'director')='director'").bind(c.id).run(); // um director por clube
        b.regiao_id = c.regiao_id;
        const r = await criarConta(DB, b);
        await DB.prepare('UPDATE clubes SET contacto_nome=?, contacto_tel=COALESCE(?, contacto_tel) WHERE id=?').bind(b.nome.trim(), tel(b.telefone), c.id).run();
        return json(r);
      } else if (b.papel === 'missao') { b.regiao_id = null; b.clube_id = null; }
      else if (b.papel !== 'regional') throw new E('Papel inválido');
      return json(await criarConta(DB, b));
    }
    if (M === 'POST' && p[2] === 'senha') {
      const a = await DB.prepare('SELECT * FROM utilizadores WHERE id=?').bind(+p[1]).first();
      if (!a) throw new E('Conta não encontrada', 404);
      const senha = rnd(3), salt = rnd(16);
      await DB.batch([DB.prepare('UPDATE utilizadores SET senha_hash=?, salt=?, trocar_senha=1 WHERE id=?').bind(await hash(senha, salt), salt, a.id), DB.prepare('DELETE FROM sessoes WHERE user_id=?').bind(a.id)]);
      return json({ login: a.email || a.telefone, senha });
    }
    if (M === 'DELETE') {
      if (+p[1] === u.id) throw new E('Não pode retirar o seu próprio acesso');
      const a = await DB.prepare('SELECT papel FROM utilizadores WHERE id=? AND ativo=1').bind(+p[1]).first();
      if (a?.papel === 'missao' && (await DB.prepare("SELECT COUNT(*) n FROM utilizadores WHERE papel='missao' AND ativo=1").first()).n <= 1) throw new E('Tem de ficar pelo menos uma conta da Missão');
      await DB.batch([DB.prepare('UPDATE utilizadores SET ativo=0 WHERE id=?').bind(+p[1]), DB.prepare('DELETE FROM sessoes WHERE user_id=?').bind(+p[1])]); return json({ ok: true }); }
  }

  // ---- dados do clube: /api/c/:id/... ----
  if (p[0] === 'c') {
    const c = await DB.prepare('SELECT c.*, r.nome regiao FROM clubes c JOIN regioes r ON r.id=c.regiao_id WHERE c.id=?').bind(+p[1]).first();
    if (!c) throw new E('Clube não encontrado', 404);
    const ler = missao || (u.papel === 'regional' && u.regiao_id === c.regiao_id) || u.clube_id === c.id;
    const escrever = missao || (u.papel === 'director' && u.clube_id === c.id);
    if (!ler) throw new E('Sem acesso a este clube', 403);
    await iniciar(DB, c);
    const ev = await DB.prepare('SELECT * FROM evento WHERE id=1').first();

    if (p[2] === 'painel') {
      const prox = (await DB.prepare(`SELECT m.titulo, ${PRAZO} prazo FROM tarefa_modelo m LEFT JOIN tarefas t ON t.clube_id=? AND t.ordem=m.ordem WHERE COALESCE(t.feita,0)=0 ORDER BY m.ordem LIMIT 3`).bind(ev.inicio, c.id).all()).results;
      const contrib = (await DB.prepare('SELECT * FROM contribuicoes WHERE clube_id=? ORDER BY id').bind(c.id).all()).results;
      return json({ clube: c, m: (await metricas(DB, [c.id]))[c.id], proximas: prox, contribuicoes: contrib, evento: ev, hoje: hoje(), editar: escrever });
    }
    if (p[2] === 'contribuicoes') {
      if (M === 'GET') return json((await DB.prepare('SELECT * FROM contribuicoes WHERE clube_id=? ORDER BY id').bind(c.id).all()).results);
      if (!escrever) throw new E('Apenas leitura', 403);
      if (M === 'DELETE') { await DB.batch([DB.prepare('DELETE FROM contrib_pagas WHERE contribuicao_id=? AND contribuicao_id IN (SELECT id FROM contribuicoes WHERE clube_id=?)').bind(+p[3], c.id), DB.prepare('DELETE FROM contribuicoes WHERE id=? AND clube_id=?').bind(+p[3], c.id)]); return json({ ok: true }); }
      const b = await body(), nome = String(b.nome || '').trim().slice(0, 60), vd = Math.max(0, Math.round(+b.valor_dbv || 0)), vr = Math.max(0, Math.round(+b.valor_dir || 0));
      if (!nome) throw new E('Indique o nome da contribuição');
      if (!vd && !vr) throw new E('Indique pelo menos um valor');
      if (M === 'POST') return json({ id: (await DB.prepare('INSERT INTO contribuicoes (clube_id,nome,valor_dbv,valor_dir) VALUES (?,?,?,?)').bind(c.id, nome, vd, vr).run()).meta.last_row_id });
      await DB.prepare('UPDATE contribuicoes SET nome=?, valor_dbv=?, valor_dir=? WHERE id=? AND clube_id=?').bind(nome, vd, vr, +p[3], c.id).run();
      return json({ ok: true });
    }
    if (p[2] === 'modelos') {
      if (M === 'GET') return json((await DB.prepare('SELECT * FROM modelos WHERE clube_id=? ORDER BY id').bind(c.id).all()).results);
      if (!escrever) throw new E('Apenas leitura', 403);
      if (M === 'DELETE') { await DB.batch([DB.prepare('DELETE FROM envios WHERE modelo_id=? AND clube_id=?').bind(+p[3], c.id), DB.prepare('DELETE FROM modelos WHERE id=? AND clube_id=?').bind(+p[3], c.id)]); return json({ ok: true }); }
      const b = await body(), t = String(b.titulo || '').trim().slice(0, 80), x = String(b.texto || '').trim().slice(0, 3000), f = ['todos', 'deve', 'docs', 'material'].includes(b.filtro) ? b.filtro : 'todos';
      if (!t || !x) throw new E('Indique o título e o texto');
      if (M === 'POST') return json({ id: (await DB.prepare('INSERT INTO modelos (clube_id,titulo,texto,filtro) VALUES (?,?,?,?)').bind(c.id, t, x, f).run()).meta.last_row_id });
      await DB.prepare('UPDATE modelos SET titulo=?, texto=?, filtro=? WHERE id=? AND clube_id=?').bind(t, x, f, +p[3], c.id).run();
      return json({ ok: true });
    }
    if (p[2] === 'envios') {
      if (M === 'GET') return json((await DB.prepare('SELECT modelo_id, participante_id, MAX(em) em FROM envios WHERE clube_id=? GROUP BY modelo_id, participante_id').bind(c.id).all()).results);
      if (!escrever) throw new E('Apenas leitura', 403);
      const b = await body();
      const ok = await DB.prepare('SELECT (SELECT COUNT(*) FROM participantes WHERE id=? AND clube_id=?) a, (SELECT COUNT(*) FROM modelos WHERE id=? AND clube_id=?) b').bind(+b.participante_id, c.id, +b.modelo_id, c.id).first();
      if (!ok.a || !ok.b) throw new E('Registo inválido');
      await DB.prepare('INSERT INTO envios (clube_id,participante_id,modelo_id) VALUES (?,?,?)').bind(c.id, +b.participante_id, +b.modelo_id).run();
      return json({ ok: true });
    }
    if (p[2] === 'itens') {
      if (M === 'GET') return json((await DB.prepare('SELECT i.id, i.nome, (SELECT COUNT(*) FROM itens_tem t JOIN participantes p ON p.id=t.participante_id WHERE t.item_id=i.id AND p.clube_id=i.clube_id) tem FROM itens i WHERE clube_id=? ORDER BY id').bind(c.id).all()).results);
      if (!escrever) throw new E('Apenas leitura', 403);
      if (M === 'DELETE') { await DB.batch([DB.prepare('DELETE FROM itens_tem WHERE item_id IN (SELECT id FROM itens WHERE id=? AND clube_id=?)').bind(+p[3], c.id), DB.prepare('DELETE FROM itens WHERE id=? AND clube_id=?').bind(+p[3], c.id)]); return json({ ok: true }); }
      const nome = String((await body()).nome || '').trim().slice(0, 60);
      if (!nome) throw new E('Indique o nome do item');
      if (M === 'POST') return json({ id: (await DB.prepare('INSERT INTO itens (clube_id,nome) VALUES (?,?)').bind(c.id, nome).run()).meta.last_row_id });
      await DB.prepare('UPDATE itens SET nome=? WHERE id=? AND clube_id=?').bind(nome, +p[3], c.id).run();
      return json({ ok: true });
    }
    if (p[2] === 'tarefas') {
      if (M === 'GET') return json((await DB.prepare(`SELECT m.ordem, m.fase, m.titulo, ${PRAZO} prazo, COALESCE(t.feita,0) feita FROM tarefa_modelo m LEFT JOIN tarefas t ON t.clube_id=? AND t.ordem=m.ordem ORDER BY m.ordem`).bind(ev.inicio, c.id).all()).results);
      if (!escrever) throw new E('Apenas leitura', 403);
      const b = await body();
      await DB.prepare('INSERT INTO tarefas (clube_id,ordem,feita) VALUES (?,?,?) ON CONFLICT(clube_id,ordem) DO UPDATE SET feita=excluded.feita').bind(c.id, +p[3], b.feita ? 1 : 0).run();
      return json({ ok: true });
    }
    if (p[2] === 'importar' && M === 'POST') {
      if (!missao) throw new E('As inscrições estão fechadas. Só a Missão pode acrescentar acampantes.', 403);
      const ja = new Set((await DB.prepare('SELECT nome FROM participantes WHERE clube_id=?').bind(c.id).all()).results.map((r) => r.nome.trim().toLowerCase()));
      const st = [], rep = [];
      for (const l of ((await body()).linhas || []).slice(0, 500)) {
        const nome = limpaNome(l.nome);
        if (!nome) continue;
        if (ja.has(nome.toLowerCase())) { rep.push(nome); continue; }
        ja.add(nome.toLowerCase());
        st.push(insParticipante(DB, c.id, l));
      }
      if (st.length) await DB.batch([...st, sobeOficial(DB, c.id)]);
      return json({ criados: st.length, repetidos: rep });
    }
    // ---- FICHAS individuais (clube e Missão; dados de saúde não vão para o Regional) ----
    if (['fichas', 'saude'].includes(p[2])) {
      if (u.papel === 'regional') throw new E('As fichas individuais só são visíveis ao clube e à Missão', 403);
      if (p[2] === 'saude') {
        const ps = (await DB.prepare("SELECT p.id, p.nome, p.categoria, p.nascimento, f.dados FROM participantes p LEFT JOIN fichas f ON f.participante_id=p.id WHERE p.clube_id=? ORDER BY p.categoria, p.nome").bind(c.id).all()).results;
        return json(ps.map((x) => { const d = JSON.parse(x.dados || '{}'); return { id: x.id, nome: x.nome, categoria: x.categoria, nascimento: x.nascimento, tipo_sangue: d.tipo_sangue || '', alergias: d.alergias || '', medicacao: d.medicacao || '', condicoes: d.condicoes || '', restricoes_alim: d.restricoes_alim || '', sabe_nadar: d.sabe_nadar || '', emerg_nome: d.emerg_nome || d.enc_nome || '', emerg_tel: d.emerg_tel || d.enc_tel || '', tem_ficha: !!x.dados }; }));
      }
      if (M === 'GET' && !p[3]) return json((await DB.prepare('SELECT f.participante_id, f.completa, f.atualizado_em, f.atualizado_por FROM fichas f JOIN participantes p ON p.id=f.participante_id WHERE p.clube_id=?').bind(c.id).all()).results);
      const pp = await DB.prepare('SELECT * FROM participantes WHERE id=? AND clube_id=?').bind(+p[3], c.id).first();
      if (!pp) throw new E('Acampante não encontrado', 404);
      if (M === 'GET') { const f = await DB.prepare('SELECT * FROM fichas WHERE participante_id=?').bind(pp.id).first(); return json({ participante: pp, dados: f ? JSON.parse(f.dados) : {}, completa: f?.completa || 0, atualizado_em: f?.atualizado_em, atualizado_por: f?.atualizado_por }); }
      if (M !== 'PUT') throw new E('Pedido inválido');
      if (!escrever) throw new E('Apenas leitura', 403);
      const b = (await body()).dados || {}, d = {};
      for (const k of FICHA_CAMPOS) if (b[k] !== undefined) d[k] = String(b[k]).trim().slice(0, 500);
      d.nascimento = dataISO(d.nascimento) || '';
      const obrig = pp.categoria === 'Desbravador' ? FICHA_OBRIG_DBV : FICHA_OBRIG_DIR;
      const completa = obrig.every((k) => d[k]) && d.ficha_entregue === 'Sim' && (pp.categoria !== 'Desbravador' || d.autorizacao_entregue === 'Sim') ? 1 : 0;
      const sync = { nascimento: d.nascimento || pp.nascimento, encarregado: d.enc_nome || pp.encarregado, telefone: pp.categoria === 'Desbravador' ? d.enc_tel || pp.telefone : pp.telefone,
        autorizacao: d.autorizacao_entregue === 'Sim' ? 1 : d.autorizacao_entregue === 'Não' ? 0 : pp.autorizacao, ficha_medica: d.ficha_entregue === 'Sim' ? 1 : d.ficha_entregue === 'Não' ? 0 : pp.ficha_medica };
      await DB.batch([
        DB.prepare(`INSERT INTO fichas (participante_id,clube_id,dados,completa,atualizado_por) VALUES (?,?,?,?,?) ON CONFLICT(participante_id) DO UPDATE SET dados=excluded.dados, completa=excluded.completa, atualizado_por=excluded.atualizado_por, atualizado_em=datetime('now','+1 hour')`).bind(pp.id, c.id, JSON.stringify(d), completa, u.nome),
        DB.prepare('UPDATE participantes SET nascimento=?, encarregado=?, telefone=?, autorizacao=?, ficha_medica=? WHERE id=?').bind(sync.nascimento, sync.encarregado, sync.telefone, sync.autorizacao, sync.ficha_medica, pp.id)]);
      return json({ completa });
    }
    if (p[2] === 'pedidos') {
      if (M === 'GET') return json((await DB.prepare('SELECT * FROM pedidos WHERE clube_id=? ORDER BY id DESC LIMIT 50').bind(c.id).all()).results);
      if (M !== 'POST' || u.papel !== 'director' || u.clube_id !== c.id) throw new E('Só a direcção do clube faz pedidos', 403);
      const b = await body(), motivo = String(b.motivo || '').trim().slice(0, 300);
      if (b.tipo === 'retirar') {
        const pp = await DB.prepare('SELECT * FROM participantes WHERE id=? AND clube_id=?').bind(+b.participante_id, c.id).first();
        if (!pp) throw new E('Acampante não encontrado');
        if (await DB.prepare("SELECT id FROM pedidos WHERE participante_id=? AND estado='pendente'").bind(pp.id).first()) throw new E('Já existe um pedido pendente para esta pessoa');
        await DB.prepare("INSERT INTO pedidos (clube_id,tipo,participante_id,nome,categoria,motivo) VALUES (?,'retirar',?,?,?,?)").bind(c.id, pp.id, pp.nome, pp.categoria, motivo).run();
      } else {
        const nome = limpaNome(b.nome);
        if (!nome) throw new E('Indique o nome');
        await DB.prepare("INSERT INTO pedidos (clube_id,tipo,nome,categoria,nascimento,motivo) VALUES (?,'incluir',?,?,?,?)").bind(c.id, nome, catDe(b.categoria), dataISO(b.nascimento), motivo).run();
      }
      return json({ ok: true });
    }
    if (p[2] === 'participantes') {
      if (M === 'GET') {
        const [ps, pg, it] = await DB.batch([
          DB.prepare(`SELECT *, CASE WHEN categoria='Desbravador' THEN ? ELSE ? END taxa FROM participantes WHERE clube_id=? ORDER BY categoria, nome`).bind(ev.taxa_dbv, ev.taxa_dir, c.id),
          DB.prepare('SELECT x.* FROM contrib_pagas x JOIN participantes p ON p.id=x.participante_id WHERE p.clube_id=?').bind(c.id),
          DB.prepare('SELECT t.* FROM itens_tem t JOIN participantes p ON p.id=t.participante_id WHERE p.clube_id=?').bind(c.id)]);
        return json(ps.results.map((q) => ({ ...q, pagas: pg.results.filter((x) => x.participante_id === q.id).map((x) => x.contribuicao_id), itens: it.results.filter((x) => x.participante_id === q.id).map((x) => x.item_id) })));
      }
      if (!escrever) throw new E('Apenas leitura', 403);
      if ((M === 'DELETE' || M === 'POST') && !missao) throw new E('As inscrições estão fechadas. Faça um pedido à Missão.', 403);
      if (M === 'DELETE') { await DB.batch([...delParticipante(DB, c.id, +p[3]), desceOficial(DB, c.id)]); return json({ ok: true }); }
      // marcar/desmarcar uma contribuição ou um item: PUT /c/:id/participantes/:pid/(contrib|item)/:x  { sim: 1|0 }
      if (M === 'PUT' && ['contrib', 'item'].includes(p[4])) {
        const pp = await DB.prepare('SELECT id FROM participantes WHERE id=? AND clube_id=?').bind(+p[3], c.id).first();
        const [tab, col, dono] = p[4] === 'contrib' ? ['contrib_pagas', 'contribuicao_id', 'contribuicoes'] : ['itens_tem', 'item_id', 'itens'];
        const ok = await DB.prepare(`SELECT id FROM ${dono} WHERE id=? AND clube_id=?`).bind(+p[5], c.id).first();
        if (!pp || !ok) throw new E('Registo inválido');
        await DB.prepare((await body()).sim ? `INSERT OR IGNORE INTO ${tab} VALUES (?,?)` : `DELETE FROM ${tab} WHERE participante_id=? AND ${col}=?`).bind(pp.id, ok.id).run();
        return json({ ok: true });
      }
      const b = await body(), F = ['nome', 'nascimento', 'telefone', 'encarregado', 'pago_inscricao', 'pago_transporte', 'autorizacao', 'ficha_medica', 'obs', ...(missao ? ['categoria'] : [])];
      const v = {}; for (const k of F) if (b[k] !== undefined) v[k] = k.startsWith('pago') || k === 'autorizacao' || k === 'ficha_medica' ? (+b[k] ? 1 : 0) : k === 'nascimento' ? dataISO(b[k]) : k === 'nome' ? limpaNome(b[k]) : String(b[k]).trim().slice(0, 300);
      if (v.categoria && !['Desbravador', 'Direção'].includes(v.categoria)) throw new E('Categoria inválida');
      const ks = Object.keys(v);
      let pid = +p[3];
      if (M === 'POST') {
        if (!v.nome) throw new E('Indique o nome');
        pid = (await DB.prepare(`INSERT INTO participantes (clube_id,${ks}) VALUES (?,${ks.map(() => '?')})`).bind(c.id, ...ks.map((k) => v[k])).run()).meta.last_row_id;
        await sobeOficial(DB, c.id).run();
      } else if (M === 'PUT' && ks.length) {
        if (v.nome === '') throw new E('Indique o nome');
        await DB.prepare(`UPDATE participantes SET ${ks.map((k) => k + '=?')} WHERE id=? AND clube_id=?`).bind(...ks.map((k) => v[k]), pid, c.id).run();
      }
      // conjuntos completos vindos do formulário
      for (const [campo, tab, col, dono] of [['pagas', 'contrib_pagas', 'contribuicao_id', 'contribuicoes'], ['itens', 'itens_tem', 'item_id', 'itens']]) {
        if (!Array.isArray(b[campo])) continue;
        const validos = new Set((await DB.prepare(`SELECT id FROM ${dono} WHERE clube_id=?`).bind(c.id).all()).results.map((r) => r.id));
        await DB.batch([DB.prepare(`DELETE FROM ${tab} WHERE participante_id IN (SELECT id FROM participantes WHERE id=? AND clube_id=?)`).bind(pid, c.id),
          ...b[campo].map(Number).filter((x) => validos.has(x)).map((x) => DB.prepare(`INSERT OR IGNORE INTO ${tab} (participante_id,${col}) VALUES (?,?)`).bind(pid, x))]);
      }
      return json({ id: pid });
    }
  }
  throw new E('Rota não encontrada', 404);
}
