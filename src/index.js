// Campori — versão simples (Cloudflare Worker + D1)
const VERSAO = '2.6';

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
  DB.prepare('DELETE FROM participantes WHERE id=? AND clube_id=?').bind(pid, cid)];

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
  const [p, t, e1, e2, i1, i2] = await DB.batch([
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
  ]);
  const out = {};
  for (const id of ids) out[id] = { n: 0, dbv: 0, dir: 0, pagos: 0, recebido: 0, sem_aut: 0, sem_ficha: 0, total: 0, feitas: 0, atrasadas: 0, devido_extra: 0, recebido_extra: 0, itens: 0, tem: 0 };
  for (const r of [p, t, e1, e2, i1, i2].flatMap((x) => x.results)) for (const [k, v] of Object.entries(r)) out[r.clube_id][k] = v ?? 0;
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
    await DB.prepare('INSERT INTO utilizadores (nome,email,telefone,senha_hash,salt,papel,regiao_id,clube_id,trocar_senha) VALUES (?,?,?,?,?,?,?,?,?)')
      .bind(b.nome.trim(), email, t, await hash(senha, salt), salt, b.papel, b.regiao_id || null, b.clube_id || null, b.trocar ?? 1).run();
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
    return json({ user: { id: u.id, nome: u.nome, papel: u.papel, clube_id: u.clube_id, regiao_id: u.regiao_id, trocar_senha: u.trocar_senha, login: u.email || u.telefone }, clube: cl, regiao: rg, evento: ev, hoje: hoje() });
  }
  if (p[0] === 'me' && p[1] === 'senha' && M === 'POST') {
    const b = await body();
    if ((await hash(b.atual || '', u.salt)) !== u.senha_hash) throw new E('Senha actual incorrecta');
    if (!b.nova || b.nova.length < 6) throw new E('A nova senha precisa de pelo menos 6 caracteres');
    const salt = rnd(16);
    await DB.prepare('UPDATE utilizadores SET senha_hash=?, salt=?, trocar_senha=0 WHERE id=?').bind(await hash(b.nova, salt), salt, u.id).run();
    return json({ ok: true });
  }

  if (p[0] === 'regioes') return json((await DB.prepare('SELECT * FROM regioes ORDER BY nome').all()).results);

  if (p[0] === 'clubes') {
    const w = u.papel === 'regional' ? 'WHERE c.regiao_id=' + +u.regiao_id : u.papel === 'director' ? 'WHERE c.id=' + +u.clube_id : '';
    return json((await DB.prepare(`SELECT c.id, c.nome, c.igreja, c.regiao_id, r.nome regiao FROM clubes c JOIN regioes r ON r.id=c.regiao_id ${w} ORDER BY r.nome, c.nome`).all()).results);
  }

  // Visão geral (Regional / Missão)
  if (p[0] === 'visao') {
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    const w = u.papel === 'regional' ? 'WHERE c.regiao_id=' + +u.regiao_id : '';
    const cl = (await DB.prepare(`SELECT c.id, c.nome, c.regiao_id, r.nome regiao, d.id dir_id, d.nome dir_nome, d.telefone dir_tel, d.email dir_email
      FROM clubes c JOIN regioes r ON r.id=c.regiao_id LEFT JOIN utilizadores d ON d.clube_id=c.id AND d.papel='director' AND d.ativo=1 ${w} GROUP BY c.id ORDER BY r.nome, c.nome`).all()).results;
    const m = await metricas(DB, cl.map((c) => c.id));
    const pend = Object.fromEntries((await DB.prepare("SELECT clube_id, COUNT(*) n FROM pedidos WHERE estado='pendente' GROUP BY clube_id").all()).results.map((r) => [r.clube_id, r.n]));
    return json(cl.map((c) => ({ ...c, ...m[c.id], pedidos: pend[c.id] || 0 })));
  }

  // ---- pedidos de inclusão/retirada ----
  if (p[0] === 'pedidos') {
    if (u.papel === 'director') throw new E('Sem permissão', 403);
    if (M === 'GET') {
      const w = u.papel === 'regional' ? 'AND c.regiao_id=' + +u.regiao_id : '';
      return json((await DB.prepare(`SELECT x.*, c.nome clube, r.nome regiao FROM pedidos x JOIN clubes c ON c.id=x.clube_id JOIN regioes r ON r.id=c.regiao_id WHERE (x.estado='pendente' OR x.respondido_em > datetime('now','-6 days')) ${w} ORDER BY x.estado='pendente' DESC, x.id DESC LIMIT 200`).all()).results);
    }
    if (!missao) throw new E('Só a Missão responde a pedidos', 403);
    const x = await DB.prepare("SELECT * FROM pedidos WHERE id=? AND estado='pendente'").bind(+p[1]).first();
    if (!x) throw new E('Pedido não encontrado ou já respondido');
    const b = await body(), aceitar = b.acao === 'aceitar';
    const st = [DB.prepare("UPDATE pedidos SET estado=?, resposta=?, respondido_em=datetime('now','+1 hour') WHERE id=?").bind(aceitar ? 'aceite' : 'recusado', String(b.resposta || '').slice(0, 300), x.id)];
    if (aceitar && x.tipo === 'incluir') st.push(insParticipante(DB, x.clube_id, x));
    if (aceitar && x.tipo === 'retirar') st.push(...delParticipante(DB, x.clube_id, x.participante_id));
    await DB.batch(st);
    return json({ ok: true });
  }

  // ---- só Missão: contas e importação ----
  if (['importar', 'contas', 'importar-acampantes'].includes(p[0]) && !missao) throw new E('Só a Missão', 403);
  if (p[0] === 'importar' && M === 'POST') {
    const regs = Object.fromEntries((await DB.prepare('SELECT * FROM regioes').all()).results.map((r) => [r.nome.toLowerCase(), r.id]));
    const res = { clubes: 0, acessos: [], erros: [] };
    for (const [i, l] of ((await body()).linhas || []).entries()) {
      const rid = regs[(l.regiao || '').trim().toLowerCase()];
      if (!rid || !l.clube) { res.erros.push(`Linha ${i + 2}: ${!rid ? `região "${l.regiao}" não existe` : 'falta o clube'}`); continue; }
      let c = await DB.prepare('SELECT id FROM clubes WHERE regiao_id=? AND nome=?').bind(rid, l.clube.trim()).first();
      if (!c) { c = { id: (await DB.prepare('INSERT INTO clubes (regiao_id,nome,igreja) VALUES (?,?,?)').bind(rid, l.clube.trim(), l.igreja || '').run()).meta.last_row_id }; res.clubes++; }
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
  if (p[0] === 'contas') {
    if (M === 'GET') return json((await DB.prepare(`SELECT u.id, u.nome, u.telefone, u.email, u.papel, r.nome regiao FROM utilizadores u LEFT JOIN regioes r ON r.id=u.regiao_id WHERE u.papel='regional' AND u.ativo=1 ORDER BY r.nome`).all()).results);
    if (M === 'POST' && !p[1]) {
      const b = await body();
      if (b.papel === 'regional' && !b.regiao_id) throw new E('Escolha a região');
      if (b.papel === 'director') {
        const c = await DB.prepare('SELECT * FROM clubes WHERE id=?').bind(+b.clube_id).first();
        if (!c) throw new E('Clube não encontrado');
        await DB.prepare("UPDATE utilizadores SET ativo=0 WHERE clube_id=? AND papel='director'").bind(c.id).run(); // um director por clube
        b.regiao_id = c.regiao_id;
      } else if (b.papel !== 'regional') throw new E('Papel inválido');
      return json(await criarConta(DB, b));
    }
    if (M === 'POST' && p[2] === 'senha') {
      const a = await DB.prepare('SELECT * FROM utilizadores WHERE id=?').bind(+p[1]).first();
      if (!a) throw new E('Conta não encontrada', 404);
      const senha = rnd(3), salt = rnd(16);
      await DB.batch([DB.prepare('UPDATE utilizadores SET senha_hash=?, salt=?, trocar_senha=1 WHERE id=?').bind(await hash(senha, salt), salt, a.id), DB.prepare('DELETE FROM sessoes WHERE user_id=?').bind(a.id)]);
      return json({ login: a.email || a.telefone, senha });
    }
    if (M === 'DELETE') { await DB.batch([DB.prepare('UPDATE utilizadores SET ativo=0 WHERE id=?').bind(+p[1]), DB.prepare('DELETE FROM sessoes WHERE user_id=?').bind(+p[1])]); return json({ ok: true }); }
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
      if (st.length) await DB.batch(st);
      return json({ criados: st.length, repetidos: rep });
    }
    if (p[2] === 'pedidos') {
      if (M === 'GET') return json((await DB.prepare('SELECT * FROM pedidos WHERE clube_id=? ORDER BY id DESC LIMIT 50').bind(c.id).all()).results);
      if (M !== 'POST' || u.papel !== 'director' || u.clube_id !== c.id) throw new E('Só o director do clube faz pedidos', 403);
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
      if (M === 'DELETE') { await DB.batch(delParticipante(DB, c.id, +p[3])); return json({ ok: true }); }
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
