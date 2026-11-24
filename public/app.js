/* Campori — versão simples */
'use strict';
const VERSAO = '4.6.1';
const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IC = {
  painel: I('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  pessoas: I('<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9"/>'),
  tarefas: I('<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>'),
  pais: I('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  material: I('<path d="M3 20h18L12 4z"/><path d="M12 20v-6"/>'),
  visao: I('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/>'),
  sair: I('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
  lua: I('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  sol: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  mais: I('<path d="M12 5v14M5 12h14"/>'),
  documentos: I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>'),
  ficha: I('<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="2.5"/><path d="M8 17c.6-2 2.1-3 4-3s3.4 1 4 3"/>'),
  secretaria: I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M9 10h6M9 14h6M9 18h3"/>'),
  avisos: I('<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12"/>'),
  sino: I('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'),
  tel: I('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  lupa: I('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  ok: I('<path d="M20 6 9 17l-5-5"/>'),
  print: I('<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
  csv: I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/>'),
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15l-1.4 5 5.2-1.4A10 10 0 1 0 12 2z"/></svg>',
};
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const kz = (n) => String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' Kz';
const dt = (s) => (s ? s.slice(8, 10) + '/' + s.slice(5, 7) : '—');
const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const st = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} } };
const wa = (t, txt) => { t = (t || '').replace(/\D/g, ''); return `https://wa.me/${t ? (t.length === 9 ? '244' + t : t) : ''}?text=${encodeURIComponent(txt)}`; };
function toast(m, e) { const t = $('#toast'); t.textContent = m; t.className = 'toast' + (e ? ' err' : ''); t.hidden = false; clearTimeout(t._t); t._t = setTimeout(() => (t.hidden = true), e ? 4000 : 2000); }
function baixar(n, txt) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + txt], { type: 'text/csv;charset=utf-8' })); a.download = n; document.body.append(a); a.click(); a.remove(); }
const csv = (c, l) => [c, ...l].map((r) => r.map((v) => { v = String(v ?? ''); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(';')).join('\n');

const S = { token: st.get('cs_token'), me: null, clube: null, clubes: [] };
async function api(m, p, b) {
  let r; try { r = await fetch('/api' + p, { method: m, headers: { 'content-type': 'application/json', ...(S.token ? { authorization: 'Bearer ' + S.token } : {}) }, body: b ? JSON.stringify(b) : undefined }); }
  catch { throw new Error('Sem ligação à internet.'); }
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && S.token && p !== '/login') { sair(true); throw new Error(d.erro); }
  if (!r.ok) throw new Error(d.erro || 'Erro ' + r.status);
  return d;
}
const papel = () => S.me?.user.papel;
const missao = () => papel() === 'missao';
const idade = (n) => (n ? Math.floor((Date.parse(S.me.evento.inicio) - Date.parse(n)) / 31557600000) : null);
const pode = () => papel() === 'missao' || (papel() === 'director' && S.clube === S.me.user.clube_id);
const tema = () => (document.documentElement.dataset.tema = st.get('cs_tema') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'));
tema();

// ---------- arranque / login ----------
async function iniciar() {
  if (!S.token) return (await api('GET', '/estado').catch(() => ({ configurado: 1 }))).configurado ? vLogin() : vSetup();
  try { S.me = await api('GET', '/me'); S.clubes = await api('GET', '/clubes'); } catch (e) { return; }
  if (S.me.user.papel === 'director') api('GET', '/avisos').then((a) => { S.naoLidos = a.filter((x) => !x.lido_em).length; if (S.naoLidos) render(); }).catch(() => {});
  const g = +st.get('cs_clube');
  S.clube = papel() === 'director' ? S.me.user.clube_id : S.clubes.some((c) => c.id === g) ? g : null;
  if (!location.hash) location.hash = papel() === 'director' ? '#/painel' : '#/visao';
  render();
  if (S.me.user.trocar_senha) setTimeout(() => mSenha(true), 300);
}
async function sair(sil) { if (!sil) await api('POST', '/logout').catch(() => {}); S.token = null; S.me = null; st.set('cs_token', null); history.replaceState(null, '', '/'); vLogin(); }
function ecraEntrada(titulo, sub, campos, botao, fn, rodape = '') {
  $('#app').innerHTML = `<div class="login"><form class="card" id="f"><img class="logo" src="/logo.png" alt=""><h1>${titulo}</h1><p class="sub">${sub}</p>${campos}<button class="btn">${botao}</button>${rodape}</form></div>`;
  $('#f').onsubmit = async (e) => { e.preventDefault(); const b = $('button', e.target); b.disabled = true; try { await fn(Object.fromEntries(new FormData(e.target))); } catch (er) { toast(er.message, 1); b.disabled = false; } };
}
async function entrar(l, s) { S.token = (await api('POST', '/login', { login: l, senha: s })).token; st.set('cs_token', S.token); history.replaceState(null, '', '/'); await iniciar(); }
function vLogin() {
  ecraEntrada('Campori 2026', 'Desbravadores · MSC', '<label>Telefone ou e-mail</label><input name="l" autocomplete="username" inputmode="email" required><label>Senha</label><input name="s" type="password" autocomplete="current-password" required>',
    'Entrar', (f) => entrar(f.l, f.s), '<p class="sub" style="margin-top:14px;font-size:13px">Esqueceu a senha? Peça à Coordenação da Missão.</p>');
}
function vSetup() {
  ecraEntrada('Primeira configuração', 'Crie a conta da Coordenação da Missão.', '<label>Nome</label><input name="nome" required><label>E-mail</label><input name="email" type="email" required><label>Senha (mín. 6)</label><input name="senha" type="password" minlength="6" required>',
    'Criar e entrar', async (f) => { await api('POST', '/setup', f); await entrar(f.email, f.senha); });
}

// ---------- estrutura ----------
const V = {};
const coord = () => S.me && papel() !== 'director';
const lk = (x) => (coord() ? '#/clube/' + x : '#/' + x); // ligação para uma página do clube
const rota = () => (location.hash.replace(/^#\/?/, '') || 'painel').split('/')[0];
function abas() { // o Painel fica sempre ao centro da barra de baixo
  return papel() === 'director'
    ? [['pessoas', 'Acampantes'], ['pais', 'Pais'], ['painel', 'Painel'], ['secretaria', 'Secretaria'], ['mais', 'Mais']]
    : [['visao', 'Clubes'], ['secretaria', 'Secretaria'], ['painel', 'Painel'], ['avisos', 'Avisos'], ['documentos', 'Documentos']];
}
const naBarra = (r, k) => r === k || (r === 'clube' && k === 'visao') || (papel() === 'director' && ['material', 'tarefas', 'avisos', 'documentos'].includes(r) && k === 'mais');
function render() {
  if (!S.me) return;
  const r = rota(), u = S.me.user, escuro = document.documentElement.dataset.tema === 'escuro';
  $('#app').innerHTML = `${navigator.onLine ? '' : '<div class="off">Sem internet</div>'}
  <header class="top"><img class="logo" src="/logo.png" alt=""><div class="tt"><b>Maranata, ${esc(u.nome.split(' ')[0])}</b><small>${esc(S.me.clube?.nome || S.me.regiao?.nome || 'Coordenação da Missão')}</small></div>
   ${coord() ? `<button class="ib" id="lp" title="Procurar">${IC.lupa}</button>` : `<button class="ib" id="sn" title="Avisos">${IC.sino}${S.naoLidos ? `<span class="dot">${S.naoLidos}</span>` : ''}</button>`}<button class="ib" id="bt" title="Tema">${escuro ? IC.sol : IC.lua}</button><button class="sair" id="bs">${IC.sair}<span>Sair</span></button></header>
  <div class="wrap"><nav class="side">${[...abas()].sort((a, b) => (b[0] === 'painel') - (a[0] === 'painel')).map(([k, n]) => `<a href="#/${k}" class="${naBarra(r, k) ? 'on' : ''}">${IC[k]}${n}</a>`).join('')}<div class="sep">v${VERSAO}</div></nav><main id="main"><div class="empty">A carregar…</div></main></div>
  <nav class="nav">${abas().map(([k, n]) => `<a href="#/${k}" class="${naBarra(r, k) ? 'on' : ''}${k === 'painel' ? ' centro' : ''}">${k === 'painel' ? `<span class="bola">${IC[k]}</span>` : IC[k]}${n}</a>`).join('')}</nav>`;
  $('#bs').onclick = () => sair();
  if ($('#lp')) $('#lp').onclick = mProcurar;
  if ($('#sn')) $('#sn').onclick = () => (location.hash = '#/avisos');
  $('#bt').onclick = () => { st.set('cs_tema', escuro ? 'claro' : 'escuro'); tema(); render(); };
  const main = $('#main');
  const v = coord() ? (r === 'painel' ? V.geral : r === 'clube' ? V.clube : V[r] || V.geral) : r === 'secretaria' ? V.secClube : V[r] || V.painel;
  v(main).catch((e) => (main.innerHTML = `<div class="alert">${esc(e.message)}</div>`));
  scrollTo(0, 0);
}
addEventListener('hashchange', render); addEventListener('online', render); addEventListener('offline', render);
(() => { let x = null, y; // deslizar entre abas
  addEventListener('touchstart', (e) => { x = e.target.closest('.modal,input,select,textarea,.marcos') ? null : e.touches[0].clientX; y = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => { if (x == null || !S.me || !$('#modal').hidden) return; const dx = e.changedTouches[0].clientX - x, dy = e.changedTouches[0].clientY - y; x = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return; const a = abas().map((t) => t[0]), i = a.indexOf(rota()), j = i + (dx < 0 ? 1 : -1); if (i >= 0 && a[j]) location.hash = '#/' + a[j]; }, { passive: true });
})();

function modal(h, fn) { const m = $('#modal'); m.innerHTML = `<div class="sheet">${h}</div>`; m.hidden = false; m.onclick = (e) => { if (e.target === m) fechar(); }; fn && fn(m); }
function fechar() { $('#modal').hidden = true; $('#modal').innerHTML = ''; }
const ro = () => '';
const barra = (n, p) => { p = Math.max(0, Math.min(100, p || 0)); return `<div style="margin:8px 0"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${n}</span><b>${p}%</b></div><div class="bar ${p < 40 ? 'r' : p < 80 ? 'o' : ''}"><span style="width:${p}%"></span></div></div>`; };
const fab = (fn) => { const b = document.createElement('button'); b.className = 'fab noprint'; b.innerHTML = IC.mais; b.onclick = fn; $('#main').append(b); };
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

// ---------- PAINEL ----------
V.painel = async (el) => {
  if (!S.clube) return (el.innerHTML = '<div class="empty">Ainda não há clubes.</div>');
  const d = await api('GET', `/c/${S.clube}/painel`), m = d.m, ev = d.evento, f = dias(d.hoje, ev.inicio);
  const txt = `*${ev.nome}*\nClube ${d.clube.nome}\n\n👥 ${m.n} acampantes (${m.dbv} desbravadores, ${m.dir} direcção)\n💰 ${m.pagos} de ${m.n} com tudo pago (${kz(m.recebido)} de ${kz(m.devido)})\n🎒 Material individual ${m.pct_material}%\n📄 Sem autorização: ${m.sem_aut} · Sem ficha médica: ${m.sem_ficha}\n✅ Checklist ${m.feitas}/${m.total}\n⏳ Faltam ${f} dias`;
  el.innerHTML = `<div class="print-h"><b>${esc(ev.nome)}</b> — ${esc(d.clube.nome)} — ${dt(d.hoje)}</div>${coord() ? '' : `<h1>${esc(d.clube.nome)}</h1><p class="sub">${esc(d.clube.regiao)}</p>`}${ro()}
  <div class="card hero"><small>${f >= 0 ? 'Dias até à partida' : 'Campori a decorrer'}</small><div class="big">${Math.max(0, f)}</div><small>${esc(ev.local)} · ${dt(ev.inicio)} a ${dt(ev.fim)}</small>
   <div class="marcos">${[['Cobrar aos membros', ev.prazo_cobranca], ['Pagar transporte', ev.prazo_transporte], ['Partida', ev.inicio]].map(([n, x]) => { const k = dias(d.hoje, x); return `<div class="marco ${k < 0 ? 'feito' : k <= 7 ? 'perto' : ''}"><b>${dt(x)}</b>${n}</div>`; }).join('')}</div></div>
  <h2>Alertas</h2>${m.alertas.length ? m.alertas.map((a) => `<div class="alert">⚠️ ${esc(a)}</div>`).join('') : '<div class="alert ok">✅ Tudo em ordem.</div>'}
  <div class="grid">
   <a class="card kpi" href="${lk('pessoas')}" style="text-decoration:none"><small>Acampantes</small><b>${m.n}</b><i>${m.dbv} dbv · ${m.dir} direcção</i></a>
   <a class="card kpi ${m.pagos >= m.n && m.n ? 'green' : 'gold'}" href="${lk('pessoas')}" style="text-decoration:none"><small>Com tudo pago</small><b>${m.pagos}/${m.n}</b><i>${kz(m.recebido)} de ${kz(m.devido)}</i></a>
  </div>
  <div class="card" style="margin-top:12px">${barra('Pagamentos', m.pct_pago)}${barra('Autorizações dos pais', pct(m.dbv - m.sem_aut, m.dbv))}${barra('Fichas médicas', pct(m.n - m.sem_ficha, m.n))}${barra('Fichas individuais completas', pct(m.fichas, m.n))}${barra('Material individual', m.pct_material)}${barra('Checklist', pct(m.feitas, m.total))}</div>
  <p class="sub" style="margin-top:10px">💰 Cada acampante paga: inscrição (${kz(ev.taxa_dbv)} dbv / ${kz(ev.taxa_dir)} direcção) + transporte ${kz(ev.transporte)}${d.contribuicoes.map((k) => ` + ${esc(k.nome)} (${k.valor_dbv === k.valor_dir ? kz(k.valor_dbv) : kz(k.valor_dbv) + ' / ' + kz(k.valor_dir)})`).join('')}.${d.editar ? ` <a href="${lk('pessoas')}" id="lc">Contribuições do clube</a>` : ''}</p>
  ${d.proximas.length ? `<h2>A seguir na checklist</h2><div class="list">${d.proximas.map((t) => { const k = dias(d.hoje, t.prazo); return `<a class="row" href="${lk('tarefas')}" style="text-decoration:none"><div class="t"><b>${esc(t.titulo)}</b></div><span class="tag ${k < 0 ? 'no' : k <= 7 ? 'w' : 'b'}">${k < 0 ? 'Atrasada' : dt(t.prazo)}</span></a>`; }).join('')}</div>` : ''}
  <div class="acts noprint"><a class="btn green" target="_blank" rel="noopener" href="${wa('', txt)}">${IC.wa} Partilhar no WhatsApp</a></div>`;
  if ($('#lc')) $('#lc').onclick = (e) => { e.preventDefault(); mContrib(); };
};

// ---------- ACAMPANTES ----------
let filtro = '', destaque = 0;
const FL = [['pago_inscricao', 'Inscrição'], ['pago_transporte', 'Transporte']], DOC = [['autorizacao', 'Autorização'], ['ficha_medica', 'Ficha']];
const valorK = (k, p) => (p.categoria === 'Desbravador' ? k.valor_dbv : k.valor_dir);
const minhas = (ks, p) => ks.filter((k) => valorK(k, p) > 0);
const deve = (p, ks) => (p.pago_inscricao ? 0 : p.taxa) + (p.pago_transporte ? 0 : S.me.evento.transporte) + minhas(ks, p).filter((k) => !p.pagas.includes(k.id)).reduce((a, k) => a + valorK(k, p), 0);
V.pessoas = async (el) => {
  if (!S.clube) return (el.innerHTML = '<div class="empty">Ainda não há clubes.</div>');
  const [ps, ks] = await Promise.all([api('GET', `/c/${S.clube}/participantes`), api('GET', `/c/${S.clube}/contribuicoes`)]), ed = pode();
  const F = { '': ['Todos', () => 1], deve: ['Por pagar', (p) => deve(p, ks) > 0], doc: ['Docs em falta', (p) => (!p.autorizacao && p.categoria === 'Desbravador') || !p.ficha_medica] };
  const l = ps.filter(F[filtro][1]); const nome = S.clubes.find((c) => c.id === S.clube)?.nome || '';
  const tag = (on, n, a) => `<button class="tag ${on ? 'ok' : 'no'}" ${a}>${on ? '✓' : '✗'} ${esc(n)}</button>`;
  el.innerHTML = `<div class="print-h"><b>Lista de acampantes</b> — ${esc(nome)}</div><h1>Acampantes</h1><p class="sub">${ps.length} inscritos · toque nas etiquetas para marcar</p>${ro()}
  ${papel() === 'director' ? `<div class="ro">🔒 Inscrições fechadas. Pode corrigir nomes e datas de nascimento; para incluir ou retirar alguém, faça um pedido à Missão.</div>` : ''}
  <div id="pd"></div>
  <div class="chips">${Object.entries(F).map(([k, [n, f]]) => `<button data-f="${k}" class="${filtro === k ? 'on' : ''}">${n} (${ps.filter(f).length})</button>`).join('')}</div>
  <div class="list">${l.map((p) => { const dv = deve(p, ks);
    return `<div class="row" data-id="${p.id}"><div class="t"><b>${esc(p.nome)}</b><small>${p.categoria}${idade(p.nascimento) != null ? ' · ' + idade(p.nascimento) + ' anos' : ''}${p.encarregado ? ' · Enc. ' + esc(p.encarregado) : ''}${p.telefone ? ' · ' + esc(p.telefone) : ''}${dv ? ` · <span style="color:var(--red)">deve ${kz(dv)}</span>` : ' · <span style="color:var(--green)">tudo pago</span>'}</small>
     <div>${FL.map(([k, n]) => tag(p[k], n, `data-k="${k}" data-p="${p.id}"`)).join('')}${minhas(ks, p).map((k) => tag(p.pagas.includes(k.id), k.nome, `data-c="${k.id}" data-p="${p.id}"`)).join('')}${DOC.map(([k, n]) => tag(p[k], n, `data-k="${k}" data-p="${p.id}"`)).join('')}</div></div></div>`; }).join('') || '<div class="empty">Ninguém aqui. Toque em + para adicionar.</div>'}</div>
  <div class="acts noprint">${ed ? `<button class="btn gold" id="ct">💰 Contribuições do clube (${ks.length})</button>` : ''}${missao() ? `<button class="btn sec" id="il">${IC.csv} Importar lista</button>` : ''}${papel() === 'director' ? '<button class="btn sec" id="pi">➕ Pedir inclusão à Missão</button>' : ''}<button class="btn sec" onclick="print()">${IC.print} Imprimir</button><button class="btn sec" id="ex">${IC.csv} Excel (CSV)</button></div>`;
  el.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { filtro = b.dataset.f; render(); }));
  $('#ex').onclick = () => baixar(`acampantes_${nome}.csv`, csv(['Nome', 'Categoria', 'Encarregado', 'Telefone', 'Inscrição', 'Transporte', ...ks.map((k) => k.nome), 'Autorização', 'Ficha médica', 'Deve (Kz)', 'Obs'],
    ps.map((p) => [p.nome, p.categoria, p.encarregado, p.telefone, p.pago_inscricao ? 'Pago' : 'Não', p.pago_transporte ? 'Pago' : 'Não', ...ks.map((k) => (!valorK(k, p) ? '—' : p.pagas.includes(k.id) ? 'Pago' : 'Não')), p.autorizacao ? 'Sim' : 'Não', p.ficha_medica ? 'Sim' : 'Não', deve(p, ks), p.obs])));
  if ($('#ct')) $('#ct').onclick = mContrib;
  if ($('#il')) $('#il').onclick = mImportarLista;
  const marcar = async (url, b) => { try { await api('PUT', url, b); render(); } catch (er) { toast(er.message, 1); } };
  el.querySelectorAll('[data-k]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); if (!ed) return; const p = ps.find((x) => x.id === +b.dataset.p); marcar(`/c/${S.clube}/participantes/${p.id}`, { [b.dataset.k]: p[b.dataset.k] ? 0 : 1 }); }));
  el.querySelectorAll('[data-c]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); if (!ed) return; const p = ps.find((x) => x.id === +b.dataset.p); marcar(`/c/${S.clube}/participantes/${p.id}/contrib/${b.dataset.c}`, { sim: p.pagas.includes(+b.dataset.c) ? 0 : 1 }); }));
  if ($('#pi')) $('#pi').onclick = () => mPedido({ tipo: 'incluir' });
  if (destaque) { const r = el.querySelector(`.row[data-id="${destaque}"]`); destaque = 0; if (r) { r.classList.add('destaque'); setTimeout(() => r.scrollIntoView({ block: 'center' }), 50); } }
  api('GET', `/c/${S.clube}/pedidos`).then((pd) => { const h = $('#pd'); if (!h || !pd.length) return; const E = { pendente: ['w', 'Pendente'], aceite: ['ok', 'Aceite'], recusado: ['no', 'Recusado'] };
    h.innerHTML = `<div class="card" style="margin-bottom:12px"><b>Pedidos à Missão</b>${pd.slice(0, 6).map((x) => `<div style="display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:14px"><span>${x.tipo === 'incluir' ? '➕ Incluir' : '➖ Retirar'} <b>${esc(x.nome)}</b>${x.resposta ? `<br><small style="color:var(--mut)">${esc(x.resposta)}</small>` : ''}</span><span class="tag ${E[x.estado][0]}">${E[x.estado][1]}</span></div>`).join('')}</div>`; }).catch(() => {});
  if (!ed) return;
  el.querySelectorAll('.row[data-id]').forEach((r) => (r.onclick = () => mPessoa(ps.find((x) => x.id === +r.dataset.id), ks)));
  if (missao()) fab(() => mPessoa({ categoria: 'Desbravador', pagas: [], itens: [] }, ks));
};
async function mPessoa(p, ks) {
  const its = await api('GET', `/c/${S.clube}/itens`);
  const ck = (n, l, on, v = '') => `<label class="ck"><input type="checkbox" name="${n}" ${v ? `value="${v}"` : ''} ${on ? 'checked' : ''}> ${esc(l)}</label>`;
  modal(`<h3>${p.id ? 'Editar acampante' : 'Novo acampante'}</h3><form id="f">
   <label>Nome completo</label><input name="nome" value="${esc(p.nome)}" required>
   <div class="fl"><div><label>Categoria</label><select name="categoria" ${missao() ? '' : 'disabled'}>${['Desbravador', 'Direção'].map((c) => `<option ${p.categoria === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
   <div><label>Data de nascimento</label><input name="nascimento" type="date" value="${esc(p.nascimento)}"></div></div>
   <label>Telefone ${p.categoria === 'Direção' ? '' : 'do encarregado'}</label><input name="telefone" inputmode="tel" value="${esc(p.telefone)}">
   <label>Nome do encarregado (pai/mãe)</label><input name="encarregado" value="${esc(p.encarregado)}" placeholder="Usado nas mensagens aos pais">
   <label>Já pagou</label><div class="fl">${ck('pago_inscricao', 'Inscrição', p.pago_inscricao)}${ck('pago_transporte', 'Transporte', p.pago_transporte)}${ks.map((k) => ck('pagas', k.nome, p.pagas.includes(k.id), k.id)).join('')}</div>
   <label>Documentos</label><div class="fl">${ck('autorizacao', 'Autorização dos pais', p.autorizacao)}${ck('ficha_medica', 'Ficha médica', p.ficha_medica)}</div>
   <label>Material que já tem</label><div class="fl">${its.map((i) => ck('itens', i.nome, p.itens.includes(i.id), i.id)).join('')}</div>
   <label>Observações (alergias, medicação…)</label><textarea name="obs">${esc(p.obs)}</textarea>
   <div class="acts">${p.id && missao() ? '<button type="button" class="btn red" id="del">Retirar</button>' : ''}${p.id && papel() === 'director' ? '<button type="button" class="btn sec" id="pr">Pedir para retirar</button>' : ''}<button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Guardar</button></div></form>`, (m) => {
    if ($('#del', m)) $('#del', m).onclick = async () => { if (!confirm(`Retirar ${p.nome}? O total de inscritos do clube desce 1.`)) return; try { await api('DELETE', `/c/${S.clube}/participantes/${p.id}`); fechar(); toast('Retirado'); render(); } catch (er) { toast(er.message, 1); } };
    if ($('#pr', m)) $('#pr', m).onclick = () => mPedido({ tipo: 'retirar', participante_id: p.id, nome: p.nome });
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const f = e.target;
      const b = { nome: f.nome.value, nascimento: f.nascimento.value, ...(missao() ? { categoria: f.categoria.value } : {}), telefone: f.telefone.value, encarregado: f.encarregado.value, obs: f.obs.value,
        pagas: [...f.querySelectorAll('[name=pagas]:checked')].map((x) => +x.value), itens: [...f.querySelectorAll('[name=itens]:checked')].map((x) => +x.value) };
      ['pago_inscricao', 'pago_transporte', 'autorizacao', 'ficha_medica'].forEach((k) => (b[k] = f[k].checked ? 1 : 0));
      const gravar = async () => { try { await api(p.id ? 'PUT' : 'POST', `/c/${S.clube}/participantes${p.id ? '/' + p.id : ''}`, b); fechar(); toast('Guardado'); render(); } catch (er) { toast(er.message, 1); } };
      gravar(); };
  });
}
function mPedido(x) {
  const inc = x.tipo === 'incluir';
  modal(`<h3>${inc ? 'Pedir inclusão à Missão' : 'Pedir para retirar ' + esc(x.nome)}</h3><p class="sub">${inc ? 'As inscrições estão fechadas. A Missão analisa o pedido e, se aceitar, a pessoa aparece na sua lista.' : 'A Missão analisa o pedido. Até lá, a pessoa continua na lista.'}</p>
   <form id="f">${inc ? `<label>Nome completo</label><input name="nome" required><div class="fl"><div><label>Categoria</label><select name="categoria"><option>Desbravador</option><option>Direção</option></select></div><div><label>Data de nascimento</label><input name="nascimento" type="date"></div></div>` : ''}
   <label>Motivo</label><textarea name="motivo" placeholder="${inc ? 'Ex.: pagou a inscrição a 08/11 mas ficou fora da lista' : 'Ex.: desistiu, viagem da família'}" required></textarea>
   <div class="acts"><button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Enviar pedido</button></div></form>`, (m) => {
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const f = e.target, b = { ...x, motivo: f.motivo.value };
      if (inc) Object.assign(b, { nome: f.nome.value, categoria: f.categoria.value, nascimento: f.nascimento.value });
      try { await api('POST', `/c/${S.clube}/pedidos`, b); fechar(); toast('Pedido enviado à Missão'); render(); } catch (er) { toast(er.message, 1); } };
  });
}
function mImportarLista() {
  modal(`<h3>Importar lista de acampantes</h3><p class="sub">Ficheiro CSV (Excel → Guardar como → CSV) ou linhas coladas, com o cabeçalho:<br><b>Nome;Categoria;Encarregado;Telefone</b><br>
   Categoria: Desbravador ou a função na direcção (Director, Líder, Conselheiro…). Só o nome é obrigatório. Nomes que já existem são ignorados.</p>
   <input type="file" id="fi" accept=".csv,.txt"><label>…ou cole aqui</label><textarea id="tx" placeholder="Nome;Categoria;Encarregado;Telefone"></textarea><p id="pv" class="sub"></p>
   <div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><button class="btn" id="go" disabled>Importar</button></div>`, (m) => {
    let L = [];
    const ler = (t) => { const R = t.replace(/\r/g, '').split('\n').filter((l) => l.trim()); if (!R.length) return [];
      const sep = R[0].includes(';') ? ';' : R[0].includes('\t') ? '\t' : ',', n = (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
      const cab = R[0].split(sep).map(n), col = (k) => cab.findIndex((h) => h.startsWith(k));
      const ix = { nome: col('nome'), categoria: Math.max(col('categ'), col('func')), encarregado: col('encarreg'), telefone: Math.max(col('tel'), col('contact')), obs: col('obs') };
      if (ix.nome < 0) return R.map((l) => ({ nome: l.split(sep)[0] }));
      return R.slice(1).map((l) => { const v = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); return Object.fromEntries(Object.entries(ix).map(([k, i]) => [k, i >= 0 ? v[i] || '' : ''])); }); };
    const ver = (t) => { L = ler(t).filter((l) => l.nome); const d = L.filter((l) => /^(desbravador|aventureiro|dbv)?$/i.test(l.categoria || '')).length;
      $('#pv', m).textContent = L.length ? `${L.length} pessoas: ${d} desbravadores e ${L.length - d} da direcção.` : ''; $('#go', m).disabled = !L.length; };
    $('#fi', m).onchange = async (e) => e.target.files[0] && ver(await e.target.files[0].text()); $('#tx', m).oninput = (e) => ver(e.target.value);
    $('#go', m).onclick = async () => { try { const r = await api('POST', `/c/${S.clube}/importar`, { linhas: L });
      modal(`<h3>Lista importada</h3><p>✅ ${r.criados} acampantes adicionados.</p>${r.repetidos.length ? `<p class="sub">Já existiam (ignorados): ${r.repetidos.map(esc).join(', ')}</p>` : ''}<div class="acts"><button class="btn" onclick="fechar();render()">Ver acampantes</button></div>`); } catch (e) { toast(e.message, 1); } };
  });
}
async function mContrib() {
  const ks = await api('GET', `/c/${S.clube}/contribuicoes`);
  modal(`<h3>Contribuições do clube</h3><p class="sub">Valores que o clube cobra além da inscrição e do transporte da Missão. Ponha 0 numa categoria que não paga.</p>
   <div class="list">${ks.map((k) => `<div class="row" data-k="${k.id}"><div class="t"><b>${esc(k.nome)}</b><small>Desbravador ${kz(k.valor_dbv)} · Direcção ${kz(k.valor_dir)}</small></div><button class="tag no" data-del="${k.id}">Apagar</button></div>`).join('') || '<p class="sub">Ainda sem contribuições.</p>'}</div>
   <h3 style="margin-top:16px" id="tt">Nova contribuição</h3><form id="f"><label>Nome</label><input name="nome" placeholder="Ex.: Alimentação, Camisola" required>
   <div class="fl"><div><label>Desbravador (Kz)</label><input name="valor_dbv" type="number" inputmode="numeric" min="0" required></div><div><label>Direcção (Kz)</label><input name="valor_dir" type="number" inputmode="numeric" min="0" required></div></div>
   <div class="acts"><button type="button" class="btn sec" onclick="fechar();render()">Fechar</button><button class="btn">Guardar</button></div></form>`, (m) => {
    let ed = null; const f = $('#f', m);
    m.querySelectorAll('.row[data-k]').forEach((r) => (r.onclick = (e) => { if (e.target.closest('[data-del]')) return; ed = ks.find((k) => k.id === +r.dataset.k); f.nome.value = ed.nome; f.valor_dbv.value = ed.valor_dbv; f.valor_dir.value = ed.valor_dir; $('#tt', m).textContent = 'Editar ' + ed.nome; }));
    m.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => { if (!confirm('Apagar esta contribuição? Os registos de quem já pagou também desaparecem.')) return; await api('DELETE', `/c/${S.clube}/contribuicoes/${b.dataset.del}`); mContrib(); }));
    f.onsubmit = async (e) => { e.preventDefault(); const b = { nome: f.nome.value, valor_dbv: +f.valor_dbv.value, valor_dir: +f.valor_dir.value };
      try { await api(ed ? 'PUT' : 'POST', `/c/${S.clube}/contribuicoes${ed ? '/' + ed.id : ''}`, b); toast('Guardado'); mContrib(); } catch (er) { toast(er.message, 1); } };
  });
}


// ---------- PAIS: canal de comunicação ----------
const CAMPOS = [['encarregado', 'Nome do encarregado'], ['nome', 'Nome do acampante'], ['pago', 'O que já pagou'], ['falta', 'O que falta pagar'], ['total_falta', 'Total em falta'],
  ['docs_falta', 'Documentos em falta'], ['material_falta', 'Material em falta'], ['dias_transporte', 'Dias até ao prazo do transporte'], ['prazo_transporte', 'Data limite do transporte'],
  ['dias_partida', 'Dias até à partida'], ['data_partida', 'Data da partida'], ['director', 'O seu nome'], ['clube', 'Nome do clube']];
const FILTROS = { todos: ['Todos', () => 1], deve: ['Por pagar', (p, x) => x.dv > 0], docs: ['Docs em falta', (p) => (!p.autorizacao && p.categoria === 'Desbravador') || !p.ficha_medica], material: ['Material em falta', (p, x) => x.mat.length > 0] };
const lista = (a, vazio) => (a.length ? a.join(', ') : vazio);
function preencher(txt, p, ctx) {
  const { ks, its, ev, hoje } = ctx, x = info(p, ctx);
  const v = { encarregado: p.encarregado || 'encarregado(a)', nome: p.nome, clube: ctx.clube, director: S.me.user.nome,
    pago: lista(x.pago, 'ainda nada registado'), falta: lista(x.falta.map(([n, k]) => `${n} (${kz(k)})`), 'nada'), total_falta: kz(x.dv),
    docs_falta: lista(x.docs, 'nada'), material_falta: lista(x.mat, 'nada'),
    dias_transporte: Math.max(0, dias(hoje, ev.prazo_transporte)), prazo_transporte: dt(ev.prazo_transporte) + '/' + ev.prazo_transporte.slice(0, 4),
    dias_partida: Math.max(0, dias(hoje, ev.inicio)), data_partida: dt(ev.inicio) + '/' + ev.inicio.slice(0, 4) };
  return txt.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
}
function info(p, { ks, its, ev }) {
  const pago = [], falta = [];
  (p.pago_inscricao ? pago : falta).push(['inscrição', p.taxa]);
  (p.pago_transporte ? pago : falta).push(['transporte', ev.transporte]);
  minhas(ks, p).forEach((k) => (p.pagas.includes(k.id) ? pago : falta).push([k.nome.toLowerCase(), valorK(k, p)]));
  const docs = []; if (p.categoria === 'Desbravador' && !p.autorizacao) docs.push('autorização dos pais'); if (!p.ficha_medica) docs.push('ficha médica');
  return { pago: pago.map((x) => x[0]), falta, dv: falta.reduce((a, x) => a + x[1], 0), docs, mat: its.filter((i) => !p.itens.includes(i.id)).map((i) => i.nome.toLowerCase()) };
}
async function ctxClube() {
  const [ps, ks, its, ms, en] = await Promise.all(['participantes', 'contribuicoes', 'itens', 'modelos', 'envios'].map((t) => api('GET', `/c/${S.clube}/${t}`)));
  return { ps, ks, its, ms, en, ev: S.me.evento, hoje: S.me.hoje, clube: S.clubes.find((c) => c.id === S.clube)?.nome || '' };
}
const pessoal = (t) => /\{(encarregado|nome|pago|falta|total_falta|docs_falta|material_falta)\}/.test(t);
V.pais = async (el) => {
  if (!S.clube) return (el.innerHTML = '<div class="empty">Ainda não há clubes.</div>');
  const id = +(location.hash.split('/')[2] || 0);
  const ctx = await ctxClube(); const ed = pode();
  const m = ctx.ms.find((x) => x.id === id);
  if (m) return vEnviar(el, m, ctx, ed);
  const comTel = ctx.ps.filter((p) => p.telefone).length;
  el.innerHTML = `<h1>Pais</h1><p class="sub">Escolha uma mensagem. Cada pai recebe-a já com os dados do seu educando, no WhatsApp.</p>${ro()}
  ${comTel < ctx.ps.length ? `<div class="alert">📵 ${ctx.ps.length - comTel} acampante(s) sem telefone. <a href="#/pessoas">Completar</a></div>` : ''}
  <div class="list">${ctx.ms.map((x) => { const alvo = ctx.ps.filter((p) => FILTROS[x.filtro][1](p, info(p, ctx))), env = alvo.filter((p) => ctx.en.some((e) => e.modelo_id === x.id && e.participante_id === p.id)).length;
    return `<a class="row" href="#/pais/${x.id}" style="text-decoration:none"><div class="t"><b>${esc(x.titulo)}</b><small>${esc((x.texto.split('\n').filter((l) => l.trim())[1] || x.texto).replace(/\{(\w+)\}/g, '…').slice(0, 90))}…</small>
     <div><span class="tag b">Para: ${FILTROS[x.filtro][0]} (${alvo.length})</span>${env ? `<span class="tag ok">Enviada a ${env}</span>` : ''}</div></div></a>`; }).join('') || '<div class="empty">Sem mensagens. Toque em + para criar.</div>'}</div>`;
  if (ed) fab(() => mModelo({ titulo: '', texto: 'Saudações, prezado(a) {encarregado}.\n\n\n\n{director}\nClube {clube}', filtro: 'todos' }));
};
function vEnviar(el, m, ctx, ed) {
  let f = st.get('cs_f' + m.id) || m.filtro; const sel = new Set();
  const regista = (pid) => { ctx.en.push({ modelo_id: m.id, participante_id: pid, em: new Date(Date.now() + 3600e3).toISOString().replace('T', ' ').slice(0, 19) }); api('POST', `/c/${S.clube}/envios`, { participante_id: pid, modelo_id: m.id }).catch(() => {}); setTimeout(() => desenhar(), 300); };
  const desenhar = () => {
    if (f !== 'nenviados' && !FILTROS[f]) f = 'todos';
    const quando = (p) => ctx.en.filter((e) => e.modelo_id === m.id && e.participante_id === p.id).map((e) => e.em).sort().pop();
    const lst = f === 'nenviados' ? ctx.ps.filter((p) => !quando(p)) : ctx.ps.filter((p) => FILTROS[f][1](p, info(p, ctx)));
    const grupo = !pessoal(m.texto);
    el.innerHTML = `<p class="sub" style="margin:0"><a href="#/pais">← Mensagens</a></p><h1>${esc(m.titulo)}</h1>${ro()}
    <div class="card" style="white-space:pre-wrap;font-size:14px">${esc(lst[0] ? preencher(m.texto, lst[0], ctx) : m.texto)}</div>
    <p class="sub" style="margin-top:6px">${lst[0] ? 'Pré-visualização para ' + esc(lst[0].nome) + '. ' : ''}${ed ? '<a href="#" id="em">Editar modelo</a>' : ''}</p>
    ${grupo ? `<div class="acts" style="margin:0 0 12px"><a class="btn green" target="_blank" rel="noopener" href="${wa('', preencher(m.texto, ctx.ps[0] || { pagas: [], itens: [] }, ctx))}">${IC.wa} Enviar ao grupo dos pais</a></div>` : ''}
    <div class="chips">${[...Object.entries(FILTROS).map(([k, [n]]) => [k, n]), ['nenviados', 'Ainda não enviados']].map(([k, n]) => `<button data-f="${k}" class="${f === k ? 'on' : ''}">${n}</button>`).join('')}</div>
    <p class="sub">${lst.length} destinatário(s) · ${lst.filter(quando).length} já enviados</p>
    ${ed && lst.some((p) => p.telefone) ? `<div class="selbar"><label class="ck" style="margin:0"><input type="checkbox" id="st" ${lst.filter((p) => p.telefone).every((p) => sel.has(p.id)) && sel.size ? 'checked' : ''}> Seleccionar todos</label>
      <button class="btn green sm" id="es" ${sel.size ? '' : 'disabled'}>${IC.wa} Enviar a ${sel.size} seleccionado(s)</button></div>` : ''}
    <div class="list">${lst.map((p) => { const q = quando(p); return `<div class="row" data-p="${p.id}">${ed && p.telefone ? `<input type="checkbox" class="sel" data-s="${p.id}" ${sel.has(p.id) ? 'checked' : ''}>` : ''}<div class="t"><b>${esc(p.encarregado || 'Encarregado de ' + p.nome.split(' ')[0])}</b><small>${esc(p.nome)} · ${p.telefone ? esc(p.telefone) : '<span style="color:var(--red)">sem telefone</span>'}</small>
      ${q ? `<div><span class="tag ok">✓ Enviada ${dt(q.slice(0, 10))} ${q.slice(11, 16)}</span></div>` : ''}</div>
      ${ed && p.telefone ? `<a class="btn green sm" data-wa="${p.id}" target="_blank" rel="noopener" href="${wa(p.telefone, preencher(m.texto, p, ctx))}">${IC.wa} Enviar</a>` : ''}</div>`; }).join('') || '<div class="empty">Ninguém neste filtro 🎉</div>'}</div>`;
    el.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { f = b.dataset.f; st.set('cs_f' + m.id, f); desenhar(); }));
    if ($('#em')) $('#em').onclick = (e) => { e.preventDefault(); mModelo(m); };
    el.querySelectorAll('[data-wa]').forEach((a) => (a.onclick = (e) => { e.stopPropagation(); regista(+a.dataset.wa); }));
    el.querySelectorAll('[data-s]').forEach((c) => (c.onclick = (e) => { e.stopPropagation(); c.checked ? sel.add(+c.dataset.s) : sel.delete(+c.dataset.s); desenhar(); }));
    if ($('#st', el)) $('#st', el).onchange = (e) => { lst.filter((p) => p.telefone).forEach((p) => (e.target.checked ? sel.add(p.id) : sel.delete(p.id))); desenhar(); };
    if ($('#es', el)) $('#es', el).onclick = () => serie(lst.filter((p) => sel.has(p.id)));
    if (ed) el.querySelectorAll('.row[data-p]').forEach((r) => (r.onclick = (e) => { if (e.target.closest('a,input')) return; const p = ctx.ps.find((x) => x.id === +r.dataset.p);
      modal(`<h3>Mensagem para ${esc(p.encarregado || 'o encarregado de ' + p.nome)}</h3><p class="sub">Pode alterar o texto só para esta pessoa.</p><textarea id="tx" style="min-height:320px">${esc(preencher(m.texto, p, ctx))}</textarea>
        <label>Telefone</label><input id="tl" inputmode="tel" value="${esc(p.telefone)}">
        <div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><a class="btn green" id="go" target="_blank" rel="noopener" href="#">${IC.wa} Abrir no WhatsApp</a></div>`, (mm) => {
          const upd = () => ($('#go', mm).href = wa($('#tl', mm).value, $('#tx', mm).value)); upd(); $('#tx', mm).oninput = upd; $('#tl', mm).oninput = upd;
          $('#go', mm).onclick = () => { if (!$('#tl', mm).value.trim()) { toast('Indique o telefone', 1); return false; } fechar(); regista(p.id); };
        }); }));
  };
  // envio em série: um toque por pai, a app passa sozinha ao seguinte
  const serie = (fila) => {
    let i = 0, feitos = 0;
    const passo = () => {
      if (i >= fila.length) { modal(`<h3>Envio concluído ✅</h3><p>Mensagem aberta para <b>${feitos}</b> de ${fila.length} encarregados.</p><div class="acts"><button class="btn" onclick="fechar()">Fechar</button></div>`); sel.clear(); desenhar(); return; }
      const p = fila[i], txt = preencher(m.texto, p, ctx);
      modal(`<h3>Envio em série · ${i + 1} de ${fila.length}</h3><div class="bar" style="margin:6px 0 12px"><span style="width:${pct(i, fila.length)}%"></span></div>
        <p style="margin:0"><b>${esc(p.encarregado || 'Encarregado de ' + p.nome)}</b><br><small style="color:var(--mut)">${esc(p.nome)} · ${esc(p.telefone)}</small></p>
        <div class="card" style="white-space:pre-wrap;font-size:13px;max-height:38vh;overflow:auto;margin-top:10px">${esc(txt)}</div>
        <p class="sub" style="margin-top:8px">Toque no botão verde, envie no WhatsApp e volte a esta página: aparece logo o encarregado seguinte.</p>
        <div class="acts"><button class="btn sec" id="sp">Parar</button><button class="btn sec" id="sk">Saltar</button><a class="btn green" id="sg" target="_blank" rel="noopener" href="${wa(p.telefone, txt)}">${IC.wa} Enviar e seguir</a></div>`, (mm) => {
        mm.onclick = null;
        $('#sp', mm).onclick = () => { fechar(); sel.clear(); desenhar(); };
        $('#sk', mm).onclick = () => { i++; passo(); };
        $('#sg', mm).onclick = () => { regista(p.id); feitos++; i++; setTimeout(passo, 400); };
      });
    };
    passo();
  };
  desenhar();
}
function mModelo(m) {
  modal(`<h3>${m.id ? 'Editar mensagem' : 'Nova mensagem'}</h3><form id="f"><label>Título</label><input name="titulo" value="${esc(m.titulo)}" placeholder="Ex.: Reunião de pais" required>
   <label>Para quem (filtro inicial)</label><select name="filtro">${Object.entries(FILTROS).map(([k, [n]]) => `<option value="${k}" ${m.filtro === k ? 'selected' : ''}>${n}</option>`).join('')}</select>
   <label>Texto</label><textarea name="texto" style="min-height:260px" required>${esc(m.texto)}</textarea>
   <p class="sub" style="margin:8px 0 4px">Toque para inserir um campo que a app preenche para cada pessoa:</p><div>${CAMPOS.map(([k, n]) => `<button type="button" class="tag b" data-c="${k}" title="${n}">${n}</button>`).join('')}</div>
   <div class="acts">${m.id ? '<button type="button" class="btn red" id="del">Apagar</button>' : ''}<button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Guardar</button></div></form>`, (mm) => {
    const ta = $('[name=texto]', mm);
    mm.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { const i = ta.selectionStart ?? ta.value.length, t = `{${b.dataset.c}}`; ta.value = ta.value.slice(0, i) + t + ta.value.slice(ta.selectionEnd ?? i); ta.focus(); ta.selectionStart = ta.selectionEnd = i + t.length; }));
    if (m.id) $('#del', mm).onclick = async () => { if (!confirm('Apagar esta mensagem?')) return; await api('DELETE', `/c/${S.clube}/modelos/${m.id}`); fechar(); location.hash = '#/pais'; render(); };
    $('#f', mm).onsubmit = async (e) => { e.preventDefault(); const f = e.target, b = { titulo: f.titulo.value, texto: f.texto.value, filtro: f.filtro.value };
      try { const r = await api(m.id ? 'PUT' : 'POST', `/c/${S.clube}/modelos${m.id ? '/' + m.id : ''}`, b); fechar(); toast('Guardado'); if (!m.id) location.hash = '#/pais/' + r.id; else render(); } catch (er) { toast(er.message, 1); } };
  });
}

// ---------- MATERIAL INDIVIDUAL ----------
V.material = async (el) => {
  if (!S.clube) return (el.innerHTML = '<div class="empty">Ainda não há clubes.</div>');
  const [its, ps] = await Promise.all([api('GET', `/c/${S.clube}/itens`), api('GET', `/c/${S.clube}/participantes`)]), ed = pode(), n = ps.length;
  const nome = S.clubes.find((c) => c.id === S.clube)?.nome || '';
  el.innerHTML = `<div class="print-h"><b>Material individual</b> — ${esc(nome)}</div><h1>Material</h1><p class="sub">Quem tem o quê · toque num item para ver e marcar${ed ? ' · + para criar item' : ''}</p>${ro()}
  <div class="list">${its.map((i) => { const pc = pct(i.tem, n); return `<div class="row" data-i="${i.id}"><div class="t"><b>${esc(i.nome)}</b><div class="bar ${pc < 40 ? 'r' : pc < 80 ? 'o' : ''}" style="margin-top:6px"><span style="width:${pc}%"></span></div></div>
    <div class="v"><b>${i.tem}/${n}</b><br><small style="color:${n - i.tem ? 'var(--red)' : 'var(--green)'}">${n - i.tem ? 'faltam ' + (n - i.tem) : 'completo'}</small></div></div>`; }).join('') || '<div class="empty">Sem itens. Toque em + para criar.</div>'}</div>
  <div class="acts noprint"><button class="btn sec" id="ex">${IC.csv} Excel: quem tem o quê</button></div>`;
  $('#ex').onclick = () => baixar(`material_${nome}.csv`, csv(['Nome', 'Categoria', ...its.map((i) => i.nome)], ps.map((p) => [p.nome, p.categoria, ...its.map((i) => (p.itens.includes(i.id) ? 'Sim' : 'Não'))])));
  el.querySelectorAll('[data-i]').forEach((r) => (r.onclick = () => mItem(its.find((i) => i.id === +r.dataset.i), ps, ed)));
  if (ed) fab(() => modal(`<h3>Novo item</h3><form id="f"><label>Nome do item</label><input name="nome" placeholder="Ex.: Bíblia, Cantil, Kit de higiene" required><div class="acts"><button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Criar</button></div></form>`, (m) => {
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); try { await api('POST', `/c/${S.clube}/itens`, { nome: e.target.nome.value }); fechar(); render(); } catch (er) { toast(er.message, 1); } }; }));
};
function mItem(i, ps, ed) {
  let soFalta = false;
  const desenhar = (m) => {
    const l = ps.filter((p) => !soFalta || !p.itens.includes(i.id)), tem = ps.filter((p) => p.itens.includes(i.id)).length;
    $('.sheet', document).innerHTML = `<h3>${esc(i.nome)}</h3><p class="sub">${tem} de ${ps.length} têm</p>
     <div class="chips"><button class="${soFalta ? '' : 'on'}" data-v="0">Todos</button><button class="${soFalta ? 'on' : ''}" data-v="1">Quem falta (${ps.length - tem})</button></div>
     <div class="list">${l.map((p) => { const on = p.itens.includes(i.id); return `<div class="row" data-p="${p.id}"><span class="chk ${on ? 'on' : ''}">${on ? IC.ok : ''}</span><div class="t"><b>${esc(p.nome)}</b><small>${p.categoria}</small></div></div>`; }).join('') || '<p class="sub">Todos têm ✅</p>'}</div>
     <div class="acts">${ed ? '<button class="btn red" id="del">Apagar item</button>' : ''}<button class="btn sec" id="fx">Fechar</button></div>`;
    const sh = $('.sheet');
    sh.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => { soFalta = b.dataset.v === '1'; desenhar(); }));
    $('#fx', sh).onclick = () => { fechar(); render(); };
    if (!ed) return;
    $('#del', sh).onclick = async () => { if (!confirm(`Apagar o item "${i.nome}" da lista?`)) return; await api('DELETE', `/c/${S.clube}/itens/${i.id}`); fechar(); render(); };
    sh.querySelectorAll('[data-p]').forEach((r) => (r.onclick = async () => { const p = ps.find((x) => x.id === +r.dataset.p), on = p.itens.includes(i.id);
      try { await api('PUT', `/c/${S.clube}/participantes/${p.id}/item/${i.id}`, { sim: on ? 0 : 1 }); p.itens = on ? p.itens.filter((x) => x !== i.id) : [...p.itens, i.id]; desenhar(); } catch (er) { toast(er.message, 1); } }));
  };
  modal('', () => desenhar());
}

// ---------- CHECKLIST ----------
V.tarefas = async (el) => {
  if (!S.clube) return (el.innerHTML = '<div class="empty">Ainda não há clubes.</div>');
  const ts = await api('GET', `/c/${S.clube}/tarefas`), h = S.me.hoje, ed = pode();
  el.innerHTML = `<h1>Checklist</h1><p class="sub">${ts.filter((t) => t.feita).length} de ${ts.length} feitas</p>${ro()}
  ${[...new Set(ts.map((t) => t.fase))].map((f) => `<div class="fase">${esc(f)}</div><div class="list">${ts.filter((t) => t.fase === f).map((t) => { const k = dias(h, t.prazo);
    return `<div class="row ${t.feita ? 'done' : ''}" data-o="${t.ordem}"><span class="chk ${t.feita ? 'on' : ''}">${t.feita ? IC.ok : ''}</span><div class="t"><b>${esc(t.titulo)}</b></div><span class="tag ${t.feita ? 'ok' : k < 0 ? 'no' : k <= 7 ? 'w' : 'b'}">${t.feita ? 'Feita' : k < 0 ? 'Atrasada' : dt(t.prazo)}</span></div>`; }).join('')}</div>`).join('')}`;
  if (ed) el.querySelectorAll('[data-o]').forEach((r) => (r.onclick = async () => { const t = ts.find((x) => x.ordem === +r.dataset.o); try { await api('PUT', `/c/${S.clube}/tarefas/${t.ordem}`, { feita: !t.feita }); render(); } catch (e) { toast(e.message, 1); } }));
};

// ---------- CLUBES (Regional / Missão) ----------
let busca = '', reg = '', alertaF = '';
const ALERTAS = [['nomes', 'Com nomes por adicionar', (c) => semNomeDe(c) > 0], ['sem_contacto', 'Sem contacto do director', (c) => !c.ct_tel], ['sem_director', 'Sem director com acesso', (c) => !c.dir_id], ['sem_acampantes', 'Sem acampantes', (c) => !c.n],
  ['sem_adultos', 'Sem adultos inscritos', (c) => c.n && !c.dir], ['racio', 'Poucos adultos para os desbravadores', (c) => c.alertas.some((a) => a.startsWith('Mais de'))],
  ['atrasadas', 'Com tarefas atrasadas', (c) => c.atrasadas > 0], ['pagar', 'Com pagamentos em falta (após o prazo)', (c) => c.alertas.some((a) => a.includes('por pagar'))],
  ['aut', 'Com autorizações em falta (após o prazo)', (c) => c.alertas.some((a) => a.includes('autorização'))], ['pedidos', 'Com pedidos à espera', (c) => c.pedidos > 0]];
// inscritos oficiais (com e sem nome) vs. pessoas com nome na app
// inscritos de um clube = o maior entre o número oficial e os nomes na app (nomes a mais são inscrições novas)
const inscritosDe = (c) => Math.max(c.inscritos_oficial ?? 0, c.n), semNomeDe = (c) => Math.max(0, (c.inscritos_oficial ?? 0) - c.n);
const oficiais = (ls) => ({ of: ls.reduce((a, c) => a + inscritosDe(c), 0), sem: ls.reduce((a, c) => a + semNomeDe(c), 0) });
// contacto do director: botões WhatsApp e Ligar
const botoesContacto = (nome, t, clube) => t ? `<a class="tag ok" target="_blank" rel="noopener" href="${wa(t, `Maranata${nome ? ', ' + nome.split(' ')[0] : ''}! Sobre o Campori do clube ${clube}: `)}">WhatsApp</a> <a class="tag b" href="tel:+244${String(t).replace(/\D/g, '').slice(-9)}">Ligar</a>` : '';
const verClubes = (r, a) => { reg = r || ''; alertaF = a || ''; busca = ''; location.hash = '#/visao'; };
V.visao = async (el) => {
  if (papel() === 'director') return V.painel(el);
  const ls = await api('GET', '/visao'), ev = S.me.evento, M = papel() === 'missao';
  const nrm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), AF = ALERTAS.find((x) => x[0] === alertaF);
  const f = ls.filter((c) => (!reg || c.regiao === reg) && (!AF || AF[2](c)) && (!busca || nrm(c.nome + ' ' + c.regiao + ' ' + (c.dir_nome || '')).includes(nrm(busca)))).sort((a, b) => b.alertas.length - a.alertas.length || a.nome.localeCompare(b.nome));
  const s = (k) => f.reduce((a, c) => a + c[k], 0), npd = ls.reduce((a, c) => a + c.pedidos, 0);
  el.innerHTML = `${npd ? `<div class="alert" style="cursor:pointer" id="vp">📨 <b>${npd} pedido(s)</b> de inclusão/retirada à espera de resposta. Toque para ver.</div>` : ''}<h1>Clubes</h1><p class="sub">${M ? 'Toda a Missão' : 'Região ' + esc(S.me.regiao?.nome)} · ${f.length} clubes · faltam ${dias(S.me.hoje, ev.inicio)} dias</p>
  <div class="grid"><div class="card kpi"><small>Inscritos</small><b>${oficiais(f).of}</b><i>${s('n')} com nome na app${oficiais(f).sem ? ` · <b style="font-size:inherit;display:inline;color:var(--red)">${oficiais(f).sem} sem nome</b>` : ''}</i></div><div class="card kpi gold"><small>Pago</small><b>${pct(s('recebido'), s('devido'))}%</b><i>${kz(s('recebido'))}</i></div>
   <div class="card kpi"><small>Checklist</small><b>${pct(s('feitas'), s('total'))}%</b></div><div class="card kpi red"><small>Clubes com alertas</small><b>${f.filter((c) => c.alertas.length).length}</b></div></div>
  <div class="tools" style="margin-top:12px"><input type="search" id="bu" placeholder="Procurar clube ou director…" value="${esc(busca)}">
   ${M ? `<select id="rg"><option value="">Todas as regiões</option>${[...new Set(ls.map((c) => c.regiao))].sort().map((r) => `<option ${r === reg ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>` : ''}
   <select id="fa"><option value="">Todos os clubes</option>${ALERTAS.map(([k, t]) => `<option value="${k}" ${alertaF === k ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>
  <div class="list">${f.map((c) => `<div class="row" data-id="${c.id}"><div class="t"><b>${esc(c.nome)}</b><small>${esc(c.regiao)} · ${c.n} com nome${semNomeDe(c) ? ` · <b style="color:var(--red)">faltam ${semNomeDe(c)} nomes</b> (oficial ${c.inscritos_oficial})` : ''} <br>👤 ${c.ct_nome ? esc(c.ct_nome) : '<span style="color:var(--red)">sem nome do director</span>'}${c.ct_tel ? ' · ' + esc(c.ct_tel) : ' · <span style="color:var(--red)">sem telefone</span>'}${c.dir_id ? '' : ' · <span style="color:var(--mut)">sem acesso à app</span>'}</small>
    <div style="display:flex;gap:10px;margin-top:6px"><div style="flex:1"><small style="color:var(--mut)">Pago ${c.pct_pago}%</small><div class="bar ${c.pct_pago < 40 ? 'r' : c.pct_pago < 80 ? 'o' : ''}"><span style="width:${c.pct_pago}%"></span></div></div><div style="flex:1"><small style="color:var(--mut)">Checklist ${pct(c.feitas, c.total)}%</small><div class="bar ${pct(c.feitas, c.total) < 40 ? 'r' : 'o'}"><span style="width:${pct(c.feitas, c.total)}%"></span></div></div></div>
    <div>${c.pedidos ? `<span class="tag w">📨 ${c.pedidos} pedido(s)</span>` : ''}${c.alertas.map((a) => `<span class="tag no">${esc(a)}</span>`).join('')}</div></div>
    <div class="v">${botoesContacto(c.ct_nome, c.ct_tel, c.nome)}${M ? `<br><button class="tag b" data-dir="${c.id}">Acesso</button>` : ''}</div></div>`).join('') || `<div class="empty">${reg || alertaF || busca ? 'Nenhum clube com estes filtros.' : 'Sem clubes.'}</div>`}</div>
  <div class="acts noprint"><button class="btn sec" id="ex">${IC.csv} Excel (CSV)</button><button class="btn sec" id="pds">📨 Pedidos</button>${M ? '<button class="btn gold" id="im">Importar clubes</button><button class="btn gold" id="ia">Importar acampantes (todos os clubes)</button><button class="btn gold" id="ic">Importar contactos dos directores</button><button class="btn sec" id="rgs">Regionais</button><button class="btn sec" id="cdn">Coordenação</button>' : ''}</div>`;
  $('#bu').oninput = (e) => { busca = e.target.value; clearTimeout(el._t); el._t = setTimeout(() => { render(); setTimeout(() => { const b = $('#bu'); if (b) { b.focus(); b.setSelectionRange(99, 99); } }); }, 350); };
  if ($('#rg')) $('#rg').onchange = (e) => { reg = e.target.value; render(); };
  $('#fa').onchange = (e) => { alertaF = e.target.value; render(); };
  $('#ex').onclick = () => baixar('clubes_campori.csv', csv(['Região', 'Clube', 'Director (contacto)', 'Telefone', 'Acampantes', 'Desbravadores', 'Direcção', 'Tudo pago', '% pago', 'Sem autorização', 'Sem ficha', '% material', 'Checklist', 'Alertas'], f.map((c) => [c.regiao, c.nome, c.ct_nome, c.ct_tel, c.n, c.dbv, c.dir, c.pagos, c.pct_pago, c.sem_aut, c.sem_ficha, c.pct_material, `${c.feitas}/${c.total}`, c.alertas.join(' | ')])));
  el.querySelectorAll('.row[data-id]').forEach((r) => (r.onclick = (e) => { if (e.target.closest('a,button')) return; S.clube = +r.dataset.id; st.set('cs_clube', S.clube); location.hash = '#/clube/painel'; }));
  el.querySelectorAll('[data-dir]').forEach((b) => (b.onclick = () => mAcesso(ls.find((c) => c.id === +b.dataset.dir))));
  if (M) { $('#im').onclick = mImportar; $('#rgs').onclick = mRegionais; $('#cdn').onclick = mCoordenacao; $('#ic').onclick = mImportarContactos; $('#ia').onclick = mImportarTodos; }
  $('#pds').onclick = mPedidos; if ($('#vp')) $('#vp').onclick = mPedidos;
  el.insertAdjacentHTML('beforeend', '<p class="sub noprint" style="text-align:center;margin-top:18px"><a href="#" id="cs">Trocar a minha senha</a></p>');
  $('#cs', el).onclick = (e) => { e.preventDefault(); mSenha(false); };
};


// ===================== MAIS (director) =====================
V.mais = async (el) => {
  const L = [['material', 'Material', 'Quem tem o quê'], ['tarefas', 'Checklist', 'Preparação do clube'], ['avisos', 'Avisos', 'Da Missão e da Região'], ['documentos', 'Documentos', 'Regulamento e outros']];
  el.innerHTML = `<h1>Mais</h1><div class="mais">${L.map(([k, n, d]) => `<a href="#/${k}">${IC[k]}${n}<br><small style="color:var(--mut);font-weight:400">${d}</small></a>`).join('')}
   <a href="#" id="cs">${IC.sair}Trocar senha<br><small style="color:var(--mut);font-weight:400">${esc(S.me.user.login)}</small></a></div>`;
  $('#cs').onclick = (e) => { e.preventDefault(); mSenha(false); };
};

// ===================== SECRETARIA DO CLUBE (director / secretário) =====================
V.secClube = async (el) => {
  const sub = location.hash.split('/')[2] || 'fichas', T = [['fichas', 'Fichas'], ['documentos', 'Documentos']];
  el.innerHTML = `<h1>Secretaria</h1><p class="sub">${esc(S.me.clube?.nome || '')}</p>
   <div class="chips">${T.map(([k, n]) => `<button data-s="${k}" class="${sub === k ? 'on' : ''}">${n}</button>`).join('')}</div><div id="sv"></div>`;
  el.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => (location.hash = '#/secretaria/' + b.dataset.s)));
  const sv = $('#sv', el);
  await ({ fichas: V.fichas, documentos: V.documentos }[sub] || V.fichas)(sv);
  const fb = sv.querySelector('.fab'); if (fb) el.append(fb);
  sv.querySelectorAll('h1').forEach((h) => h.remove());
};

// ---------- FICHAS individuais ----------
const SIM_NAO = ['', 'Sim', 'Não'];
const FICHA = [
  ['Dados pessoais', [['nascimento', 'Data de nascimento', 'date'], ['sexo', 'Sexo', ['', 'M', 'F']], ['morada', 'Morada / bairro'], ['escola_classe', 'Escola e classe']]],
  ['Encarregado de educação', [['enc_nome', 'Nome do encarregado'], ['enc_parentesco', 'Parentesco', ['', 'Pai', 'Mãe', 'Avô/Avó', 'Tio/Tia', 'Irmão/Irmã', 'Outro']], ['enc_tel', 'Telefone', 'tel'], ['enc_tel2', 'Telefone alternativo', 'tel']]],
  ['Contacto de emergência', [['emerg_nome', 'Nome (se diferente do encarregado)'], ['emerg_tel', 'Telefone', 'tel']]],
  ['Saúde', [['tipo_sangue', 'Tipo sanguíneo', ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Não sabe']], ['sabe_nadar', 'Sabe nadar', SIM_NAO],
    ['alergias', 'Alergias (alimentos, medicamentos, picadas)', 'nada'], ['medicacao', 'Medicação que toma (nome e horário)', 'nada'], ['condicoes', 'Doenças ou condições (asma, epilepsia, drepanocitose, diabetes…)', 'nada'],
    ['restricoes_alim', 'Restrições alimentares'], ['obs_saude', 'Outras informações para a equipa de saúde', 'area']]],
  ['Autorizações', [['autoriza_tratamento', 'O encarregado autoriza tratamento médico de urgência', SIM_NAO], ['autoriza_imagem', 'Autoriza fotografias e vídeos', SIM_NAO],
    ['autorizacao_entregue', 'Autorização de participação assinada e entregue', SIM_NAO], ['ficha_entregue', 'Ficha médica assinada e entregue', SIM_NAO], ['data_entrega', 'Data de entrega', 'date'], ['recebido_por', 'Recebido por']]],
];
const OBRIG = { Desbravador: ['nascimento', 'enc_nome', 'enc_tel', 'tipo_sangue', 'alergias', 'medicacao', 'condicoes', 'autoriza_tratamento', 'autorizacao_entregue', 'ficha_entregue'], Direção: ['emerg_nome', 'emerg_tel', 'tipo_sangue', 'alergias', 'medicacao', 'condicoes', 'ficha_entregue'] };
const ROT = Object.fromEntries(FICHA.flatMap(([, cs]) => cs.map(([k, l]) => [k, l])));
const emFalta = (d, cat) => OBRIG[cat === 'Desbravador' ? 'Desbravador' : 'Direção'].filter((k) => !d[k] || ((k === 'autorizacao_entregue' || k === 'ficha_entregue') && d[k] !== 'Sim'));
let filtroF = '';
V.fichas = async (el) => {
  const [ps, fs] = await Promise.all([api('GET', `/c/${S.clube}/participantes`), api('GET', `/c/${S.clube}/fichas`)]), ed = pode();
  const F = Object.fromEntries(fs.map((f) => [f.participante_id, f]));
  const est = (p) => (!F[p.id] ? 'vazia' : F[p.id].completa ? 'completa' : 'incompleta');
  const E = { completa: ['ok', 'Completa'], incompleta: ['w', 'Incompleta'], vazia: ['no', 'Por preencher'] };
  const l = ps.filter((p) => !filtroF || est(p) === filtroF), nC = ps.filter((p) => est(p) === 'completa').length;
  el.innerHTML = `<h1>Fichas</h1><p class="sub">Ficha individual de cada acampante: dados, encarregado, saúde e autorizações. Só a direcção do clube e a Missão a vêem.</p>
   <div class="card">${barra(`Fichas completas: ${nC} de ${ps.length}`, pct(nC, ps.length))}</div>
   <div class="chips" style="margin-top:12px">${[['', 'Todas'], ['vazia', 'Por preencher'], ['incompleta', 'Incompletas'], ['completa', 'Completas']].map(([k, n]) => `<button data-f="${k}" class="${filtroF === k ? 'on' : ''}">${n} (${k ? ps.filter((p) => est(p) === k).length : ps.length})</button>`).join('')}</div>
   <div class="list">${l.map((p) => `<div class="row" data-p="${p.id}"><div class="t"><b>${esc(p.nome)}</b><small>${p.categoria}${F[p.id] ? ' · actualizada ' + dt(F[p.id].atualizado_em.slice(0, 10)) + (F[p.id].atualizado_por ? ' por ' + esc(F[p.id].atualizado_por.split(' ')[0]) : '') : ''}</small></div><span class="tag ${E[est(p)][0]}">${E[est(p)][1]}</span></div>`).join('') || '<div class="empty">Ninguém neste filtro.</div>'}</div>
   <div class="acts noprint"><button class="btn gold" id="rs">🩺 Resumo de saúde</button><button class="btn sec" id="ex">${IC.csv} Excel (CSV)</button></div>`;
  el.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { filtroF = b.dataset.f; render(); }));
  el.querySelectorAll('[data-p]').forEach((r) => (r.onclick = () => mFicha(+r.dataset.p, ed)));
  $('#rs', el).onclick = resumoSaude;
  $('#ex', el).onclick = async () => { const sd = await api('GET', `/c/${S.clube}/saude`);
    baixar(`saude_${S.clubes.find((c) => c.id === S.clube)?.nome || S.me.clube?.nome}.csv`, csv(['Nome', 'Categoria', 'Nascimento', 'Tipo sanguíneo', 'Alergias', 'Medicação', 'Condições', 'Restrições alimentares', 'Sabe nadar', 'Contacto de emergência', 'Telefone'], sd.map((x) => [x.nome, x.categoria, dt(x.nascimento) + (x.nascimento ? '/' + x.nascimento.slice(0, 4) : ''), x.tipo_sangue, x.alergias, x.medicacao, x.condicoes, x.restricoes_alim, x.sabe_nadar, x.emerg_nome, x.emerg_tel]))); };
};
async function mFicha(pid, ed) {
  const f = await api('GET', `/c/${S.clube}/fichas/${pid}`), p = f.participante, d = { nascimento: p.nascimento, enc_nome: p.encarregado, enc_tel: p.categoria === 'Desbravador' ? p.telefone : '', ...f.dados };
  if (!d.recebido_por && ed) d.recebido_por = '';
  const campo = ([k, l, t]) => {
    const v = d[k] ?? '', dis = ed ? '' : 'disabled', ob = emFalta({}, p.categoria).includes(k) ? ' *' : '';
    if (Array.isArray(t)) return `<div><label>${esc(l)}${ob}</label><select name="${k}" ${dis}>${t.map((o) => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
    if (t === 'nada') return `<div class="full"><label>${esc(l)}${ob}</label><div style="display:flex;gap:6px"><input name="${k}" value="${esc(v)}" ${dis}>${ed ? `<button type="button" class="btn sm sec" data-nada="${k}">Nenhuma</button>` : ''}</div></div>`;
    if (t === 'area') return `<div class="full"><label>${esc(l)}</label><textarea name="${k}" ${dis}>${esc(v)}</textarea></div>`;
    return `<div><label>${esc(l)}${ob}</label><input name="${k}" type="${t || 'text'}" value="${esc(v)}" ${t === 'tel' ? 'inputmode="tel"' : ''} ${dis}></div>`;
  };
  const secs = FICHA.filter(([n]) => !(p.categoria !== 'Desbravador' && n === 'Encarregado de educação'));
  modal(`<h3>Ficha de ${esc(p.nome)}</h3><p class="sub">${p.categoria}${f.atualizado_em ? ` · actualizada a ${dt(f.atualizado_em.slice(0, 10))}${f.atualizado_por ? ' por ' + esc(f.atualizado_por) : ''}` : ' · ainda não preenchida'}</p>
   <div id="ff" class="falta"></div><form id="f">${secs.map(([n, cs]) => `<div class="secc">${n}</div><div class="fl">${cs.map(campo).join('')}</div>`).join('')}
   <p class="sub" style="margin-top:10px">* Obrigatório para a ficha ficar completa. Ao guardar, a app actualiza também a data de nascimento, o encarregado e as etiquetas Autorização e Ficha do acampante.</p>
   <div class="acts"><button type="button" class="btn sec" id="pf">${IC.print} Imprimir</button><button type="button" class="btn sec" onclick="fechar()">Fechar</button>${ed ? '<button class="btn">Guardar ficha</button>' : ''}</div></form>`, (m) => {
    const form = $('#f', m), ler = () => Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
    const mostra = () => { const x = emFalta(ler(), p.categoria); $('#ff', m).innerHTML = x.length ? `Falta para ficar completa: ${x.map((k) => esc(ROT[k])).join(' · ')}` : '<span style="color:var(--green)">✅ Ficha completa</span>'; };
    mostra(); form.oninput = mostra; form.onchange = mostra;
    m.querySelectorAll('[data-nada]').forEach((b) => (b.onclick = () => { form[b.dataset.nada].value = 'Nenhuma'; mostra(); }));
    $('#pf', m).onclick = () => imprimirFicha(p, ed ? ler() : d);
    if (ed) form.onsubmit = async (e) => { e.preventDefault(); const dados = ler(); if (!dados.recebido_por && (dados.autorizacao_entregue === 'Sim' || dados.ficha_entregue === 'Sim')) dados.recebido_por = S.me.user.nome;
      try { const r = await api('PUT', `/c/${S.clube}/fichas/${pid}`, { dados }); fechar(); toast(r.completa ? 'Ficha completa ✅' : 'Ficha guardada (ainda incompleta)'); render(); } catch (er) { toast(er.message, 1); } };
  });
}
function janelaImpressao(titulo, corpo, css = '') {
  const w = window.open('', '_blank'); if (!w) return toast('Permita janelas pop-up para imprimir', 1);
  w.document.write(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>body{font:13px/1.45 system-ui,Arial,sans-serif;color:#111;margin:24px}h1{font-size:18px;margin:0}h2{font-size:13px;text-transform:uppercase;border-bottom:1px solid #999;margin:16px 0 6px;padding-bottom:3px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:5px 6px;text-align:left;vertical-align:top}th{background:#eef2f8;font-size:11px}.cab{display:flex;gap:14px;align-items:center;border-bottom:3px solid #0B2A4A;padding-bottom:8px;margin-bottom:8px}.cab img{height:64px}.ass{margin-top:40px;display:flex;gap:40px}.ass div{flex:1;border-top:1px solid #333;text-align:center;padding-top:4px;font-size:12px}@media print{body{margin:10mm}}${css}</style></head><body>
   <div class="cab"><img src="${location.origin}/logo.png"><div><h1>${esc(titulo)}</h1><div>${esc(S.me.evento.nome)} · ${esc(S.clubes.find((c) => c.id === S.clube)?.nome || S.me.clube?.nome || '')}</div></div></div>${corpo}<script>setTimeout(()=>print(),400)<\/script></body></html>`);
  w.document.close();
}
function imprimirFicha(p, d) {
  const linha = ([k, l]) => `<tr><th style="width:42%">${esc(l)}</th><td>${esc(d[k] && /^\d{4}-\d{2}-\d{2}$/.test(d[k]) ? dt(d[k]) + '/' + d[k].slice(0, 4) : d[k] || '')}</td></tr>`;
  // uma só folha A4: secções em duas colunas e letra compacta
  const sec = ([n, cs]) => `<h2>${n}</h2><table>${cs.map(linha).join('')}</table>`;
  const S2 = FICHA.filter(([n]) => !(p.categoria !== 'Desbravador' && n === 'Encarregado de educação'));
  const esq = S2.filter(([n]) => n !== 'Saúde' && n !== 'Autorizações'), dir = S2.filter(([n]) => n === 'Saúde' || n === 'Autorizações');
  janelaImpressao('Ficha individual — ' + p.nome, `<p class="nome"><b>${esc(p.nome)}</b> · ${p.categoria}</p><div class="cols"><div>${esq.map(sec).join('')}</div><div>${dir.map(sec).join('')}</div></div>
   <div class="ass"><div>Assinatura do encarregado</div><div>Assinatura do director do clube</div></div>`,
   `@page{size:A4;margin:10mm}body{font-size:12.5px;line-height:1.35;margin:12px}@media print{body{margin:0}}.cab{padding-bottom:5px;margin-bottom:5px}.cab img{height:46px}h1{font-size:15px}.nome{margin:4px 0 2px;font-size:13px}
    h2{font-size:12px;margin:12px 0 4px}td,th{padding:5px 6px}th{font-size:11px;width:45%!important}.cols{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}.cols>div{min-width:0}td{word-break:break-word}
    .ass{margin-top:48px;gap:30px;break-inside:avoid}body *{break-inside:avoid}`);
}
async function resumoSaude() {
  const sd = await api('GET', `/c/${S.clube}/saude`), com = sd.filter((x) => [x.alergias, x.medicacao, x.condicoes, x.restricoes_alim].some((v) => v && !/^nenhum/i.test(v)));
  janelaImpressao('Resumo de saúde', `<p>Acampantes com alergias, medicação, condições de saúde ou restrições alimentares: <b>${com.length}</b> de ${sd.length}. Fichas por preencher: <b>${sd.filter((x) => !x.tem_ficha).length}</b>.</p>
   <table><tr><th>Nome</th><th>Sangue</th><th>Alergias</th><th>Medicação</th><th>Condições</th><th>Restrições</th><th>Emergência</th></tr>${com.map((x) => `<tr><td><b>${esc(x.nome)}</b><br>${x.categoria}</td><td>${esc(x.tipo_sangue)}</td><td>${esc(x.alergias)}</td><td>${esc(x.medicacao)}</td><td>${esc(x.condicoes)}</td><td>${esc(x.restricoes_alim)}</td><td>${esc(x.emerg_nome)}<br>${esc(x.emerg_tel)}</td></tr>`).join('') || '<tr><td colspan="7">Nenhum registo.</td></tr>'}</table>
   <h2>Não sabem nadar</h2><p>${sd.filter((x) => x.sabe_nadar === 'Não').map((x) => esc(x.nome)).join(', ') || '—'}</p>`);
}

// ===================== DOCUMENTOS =====================
const tamanho = (n) => (n > 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.ceil(n / 1024) + ' KB');
const iconeDoc = (t, f) => (/pdf/.test(t) || /\.pdf$/i.test(f) ? '📕' : /word|\.docx?$/i.test(t + f) ? '📘' : /sheet|excel|\.xlsx?$|csv/i.test(t + f) ? '📗' : /image/.test(t) ? '🖼️' : /presentation|\.pptx?$/i.test(t + f) ? '📙' : '📄');
V.documentos = async (el) => {
  const ds = await api('GET', '/documentos'), pub = coord();
  el.innerHTML = `<h1>Documentos</h1><p class="sub">${pub ? 'Publique documentos para todos os clubes ou para uma região.' : 'Documentos da Missão e da sua Região. Toque para abrir ou guardar.'}</p>
   <div class="list">${ds.map((d) => `<div class="row" data-d="${d.id}"><span style="font-size:26px">${iconeDoc(d.tipo, d.ficheiro)}</span><div class="t"><b>${esc(d.titulo)}</b><small>${d.descricao ? esc(d.descricao) + ' · ' : ''}${tamanho(d.tamanho)} · ${dt(d.criado_em.slice(0, 10))}${pub ? ' · Para: ' + (d.alvo === 'todos' ? 'todos os clubes' : 'Região ' + esc(d.regiao || '')) : ''}</small></div>
     <div class="v"><button class="btn sm" data-b="${d.id}">Abrir</button>${pub && (missao() || d.autor_id === S.me.user.id) ? `<br><button class="tag no" data-x="${d.id}">Apagar</button>` : ''}</div></div>`).join('') || '<div class="empty">Ainda não há documentos.</div>'}</div>`;
  el.querySelectorAll('[data-b]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); baixarDoc(ds.find((d) => d.id === +b.dataset.b), b); }));
  el.querySelectorAll('.row[data-d]').forEach((r) => (r.onclick = () => baixarDoc(ds.find((d) => d.id === +r.dataset.d), r.querySelector('[data-b]'))));
  el.querySelectorAll('[data-x]').forEach((b) => (b.onclick = async (e) => { e.stopPropagation(); if (!confirm('Apagar este documento para todos?')) return; await api('DELETE', '/documentos/' + b.dataset.x); render(); }));
  if (pub) fab(mDocumento);
};
async function baixarDoc(d, btn) {
  const t0 = btn?.textContent; const partes = [];
  try {
    for (let n = 0; n < d.partes; n++) {
      if (btn) btn.textContent = d.partes > 1 ? `${Math.round((n / d.partes) * 100)}%` : '…';
      const r = await fetch(`/api/documentos/${d.id}/parte/${n}`, { headers: { authorization: 'Bearer ' + S.token } });
      if (!r.ok) throw new Error('Não foi possível descarregar');
      partes.push(await r.arrayBuffer());
    }
    const url = URL.createObjectURL(new Blob(partes, { type: d.tipo || 'application/octet-stream' }));
    const a = document.createElement('a'); a.href = url; a.download = d.ficheiro; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (e) { toast(e.message, 1); } finally { if (btn) btn.textContent = t0; }
}
function mDocumento() {
  const M = missao(), regs = [...new Set(S.clubes.map((c) => c.regiao))].sort();
  modal(`<h3>Publicar documento</h3><form id="f"><label>Ficheiro (até 20 MB)</label><input type="file" name="fi" required>
   <label>Título</label><input name="titulo" required placeholder="Ex.: Regulamento do II Campori"><label>Descrição (opcional)</label><input name="descricao">
   ${M ? `<label>Para</label><select name="alvo"><option value="todos">Todos os clubes</option>${regs.map((r) => `<option value="${esc(r)}">Região ${esc(r)}</option>`).join('')}</select>` : '<p class="sub">Fica disponível para os clubes da sua região.</p>'}
   <p id="pg" class="sub"></p><div class="acts"><button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Publicar</button></div></form>`, (m) => {
    const f = $('#f', m);
    f.fi.onchange = () => { const x = f.fi.files[0]; if (x && !f.titulo.value) f.titulo.value = x.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '); };
    f.onsubmit = async (e) => { e.preventDefault(); const x = f.fi.files[0], bt = $('button.btn:not(.sec)', f); if (!x) return;
      if (x.size > 20 * 1048576) return toast('O ficheiro tem mais de 20 MB', 1);
      bt.disabled = true;
      try {
        let alvo = 'todos', regiao_id = null;
        if (M && f.alvo.value !== 'todos') { alvo = 'regiao'; regiao_id = (await api('GET', '/regioes')).find((r) => r.nome === f.alvo.value)?.id; }
        const r = await api('POST', '/documentos', { titulo: f.titulo.value, descricao: f.descricao.value, ficheiro: x.name, tipo: x.type, tamanho: x.size, alvo, regiao_id });
        const n = Math.ceil(x.size / r.parte);
        for (let i = 0; i < n; i++) {
          $('#pg', m).textContent = `A enviar… ${Math.round((i / n) * 100)}%`;
          const res = await fetch(`/api/documentos/${r.id}/parte/${i}`, { method: 'PUT', headers: { authorization: 'Bearer ' + S.token }, body: x.slice(i * r.parte, (i + 1) * r.parte) });
          if (!res.ok) throw new Error((await res.json().catch(() => ({}))).erro || 'Falhou o envio');
        }
        fechar(); toast('Documento publicado'); render();
      } catch (er) { toast(er.message, 1); bt.disabled = false; $('#pg', m).textContent = ''; } };
  });
}

// ===================== AVISOS =====================
const paraQuem = (a) => (a.alvo === 'todos' ? 'Todos os directores' : a.alvo === 'regiao' ? 'Região ' + (a.regiao || '') : 'Clube ' + (a.clube || ''));
V.avisos = async (el) => {
  const av = await api('GET', '/avisos');
  if (papel() === 'director') {
    el.innerHTML = `<h1>Avisos</h1><p class="sub">Comunicados da Missão e da sua Região</p><div class="list">${av.map((a) => `<div class="card" style="${a.lido_em ? '' : 'border-color:var(--gold);border-width:2px'}">
      <div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(a.titulo)}</b>${a.lido_em ? '' : '<span class="tag w">Novo</span>'}</div>
      <p style="white-space:pre-wrap;margin:6px 0">${esc(a.texto)}</p><small style="color:var(--mut)">${esc(a.autor_nome || '')} · ${dt(a.criado_em.slice(0, 10))} ${a.criado_em.slice(11, 16)}</small></div>`).join('') || '<div class="empty">Ainda não há avisos.</div>'}</div>`;
    const nl = av.filter((a) => !a.lido_em); for (const a of nl) api('POST', `/avisos/${a.id}/lido`).catch(() => {});
    if (nl.length) { S.naoLidos = 0; const d = $('#sn .dot'); if (d) d.remove(); }
    return;
  }
  el.innerHTML = `<h1>Avisos</h1><p class="sub">Informações para os directores. Cada director vê-as no sino 🔔 da app; aqui sabe quem já leu.</p>
  <div class="list">${av.map((a) => { const pc = pct(a.lidos, a.destinatarios); return `<div class="card"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(a.titulo)}</b><small style="color:var(--mut);white-space:nowrap">${dt(a.criado_em.slice(0, 10))}</small></div>
    <p style="white-space:pre-wrap;margin:6px 0;font-size:14px">${esc(a.texto)}</p><small style="color:var(--mut)">Para: ${esc(paraQuem(a))} · ${esc(a.autor_nome || '')}</small>
    <div style="margin-top:8px"><small>Lido por <b>${a.lidos}</b> de ${a.destinatarios} directores com acesso</small><div class="bar ${pc < 40 ? 'r' : pc < 80 ? 'o' : ''}"><span style="width:${pc}%"></span></div></div>
    <div class="acts" style="margin-top:8px">${a.por_ler.length ? `<button class="btn sm gold" data-pl="${a.id}">Quem não leu (${a.por_ler.length})</button>` : ''}<a class="btn sm green" target="_blank" rel="noopener" href="${wa('', `*${a.titulo}*\n\n${a.texto}\n\n— ${a.autor_nome}`)}">${IC.wa} Grupo</a>${missao() || a.autor_id === S.me.user.id ? `<button class="btn sm sec" data-del="${a.id}">Apagar</button>` : ''}</div></div>`; }).join('') || '<div class="empty">Ainda não enviou avisos. Toque em + para criar.</div>'}</div>`;
  el.querySelectorAll('[data-pl]').forEach((b) => (b.onclick = () => { const a = av.find((x) => x.id === +b.dataset.pl);
    modal(`<h3>Ainda não leram: ${esc(a.titulo)}</h3><p class="sub">Toque em WhatsApp para lembrar o director.</p><div class="list">${a.por_ler.map((d) => `<div class="row" style="cursor:default"><div class="t"><b>${esc(d.nome)}</b><small>${esc(d.clube)}</small></div>${d.telefone ? `<a class="btn sm green" target="_blank" rel="noopener" href="${wa(d.telefone, `Maranata, ${d.nome.split(' ')[0]}! Há um aviso novo na app do Campori: *${a.titulo}*. Abra a app e veja no sino 🔔: ${location.origin}`)}">${IC.wa}</a>` : ''}</div>`).join('')}</div><div class="acts"><button class="btn sec" onclick="fechar()">Fechar</button></div>`); }));
  el.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => { if (!confirm('Apagar este aviso?')) return; await api('DELETE', '/avisos/' + b.dataset.del); render(); }));
  fab(mAviso);
};
function campoClube(id, valor = '') {
  return `<input id="${id}" list="${id}l" placeholder="Escreva o nome do clube…" value="${esc(valor)}" autocomplete="off"><datalist id="${id}l">${S.clubes.map((c) => `<option value="${esc(c.nome + ' · ' + c.regiao)}">`).join('')}</datalist>`;
}
const clubeDe = (txt) => S.clubes.find((c) => c.nome + ' · ' + c.regiao === txt);
function mAviso() {
  const M = missao(), regs = [...new Set(S.clubes.map((c) => c.regiao))].sort();
  modal(`<h3>Novo aviso aos directores</h3><form id="f"><label>Título</label><input name="titulo" required placeholder="Ex.: Pagamento do transporte até 06/12">
   <label>Mensagem</label><textarea name="texto" style="min-height:160px"></textarea>
   <label>Para</label><select name="alvo">${M ? '<option value="todos">Todos os directores</option><option value="regiao">Uma região</option>' : '<option value="todos">Todos os directores da região</option>'}<option value="clube">Um clube</option></select>
   <div id="pr" hidden><label>Região</label><select name="regiao">${regs.map((r) => `<option>${esc(r)}</option>`).join('')}</select></div>
   <div id="pc" hidden><label>Clube</label>${campoClube('qcl')}</div>
   <div class="acts"><button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Enviar aviso</button></div></form>`, (m) => {
    const f = $('#f', m); f.alvo.onchange = () => { $('#pr', m).hidden = f.alvo.value !== 'regiao'; $('#pc', m).hidden = f.alvo.value !== 'clube'; };
    f.onsubmit = async (e) => { e.preventDefault(); const b = { titulo: f.titulo.value, texto: f.texto.value, alvo: f.alvo.value };
      if (b.alvo === 'regiao') { const r = (await api('GET', '/regioes')).find((x) => x.nome === f.regiao.value); b.regiao_id = r?.id; }
      if (b.alvo === 'clube') { const c = clubeDe($('#qcl', m).value); if (!c) return toast('Escolha um clube da lista', 1); b.clube_id = c.id; }
      try { await api('POST', '/avisos', b); fechar(); toast('Aviso enviado'); render(); } catch (er) { toast(er.message, 1); } };
  });
}

// ===================== SECRETARIA =====================
const TIPOS = { lista: 'Lista nominal', adultos: 'Adultos / supervisão', acesso: 'Acesso do director', pagamentos: 'Pagamentos', aventureiros: 'Aventureiros', pedidos: 'Pedidos', documentos: 'Documentos', outro: 'Outro' };
let secF = { estado: 'abertos', tipo: '', reg: '', q: '' }, verTodasSug = false;
V.secretaria = async (el) => {
  const d = await api('GET', '/secretaria'), M = missao(), F = secF;
  const nrm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const ok = (x) => (!F.tipo || x.tipo === F.tipo) && (!F.reg || x.regiao === F.reg) && (!F.q || nrm(x.titulo + ' ' + x.clube + ' ' + (x.responsavel || '')).includes(nrm(F.q)));
  const ab = d.casos.filter((k) => k.estado !== 'Resolvido'), sug = d.sugestoes.filter(ok);
  const cs = d.casos.filter((k) => (F.estado === 'abertos' ? k.estado !== 'Resolvido' : F.estado === 'resolvidos' ? k.estado === 'Resolvido' : true) && ok(k));
  const regs = [...new Set(S.clubes.map((c) => c.regiao))].sort(), cor = { Aberto: 'no', 'Em curso': 'w', Resolvido: 'ok' };
  el.innerHTML = `<h1>Secretaria</h1><p class="sub">${M ? 'Seguimento caso a caso de tudo o que falta resolver' : 'Casos da sua região (consulta)'}</p>
  <div class="grid"><div class="card kpi red"><small>Casos em aberto</small><b>${ab.length}</b><i>${ab.filter((k) => k.prioridade === 'Alta').length} de prioridade alta</i></div>
   <div class="card kpi gold"><small>Por analisar</small><b>${d.sugestoes.length}</b><i>detectados pela app</i></div>
   <div class="card kpi green"><small>Resolvidos</small><b>${d.casos.filter((k) => k.estado === 'Resolvido').length}</b><i>últimos 14 dias</i></div>
   <div class="card kpi"><small>Inscritos oficiais</small><b>${d.oficiais}/${d.clubes}</b><i>clubes com o número oficial</i></div></div>
  ${d.oficiais < d.clubes && M ? `<div class="ro" style="margin-top:12px">Para a app detectar listas incompletas e clubes sem lista, carregue os <b>inscritos oficiais</b> de cada clube (botão em baixo).</div>` : ''}
  <div class="tools" style="margin-top:12px"><input type="search" id="sq" placeholder="Procurar clube, assunto ou responsável…" value="${esc(F.q)}">
   ${M ? `<select id="sr"><option value="">Todas as regiões</option>${regs.map((r) => `<option ${F.reg === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>` : ''}
   <select id="st"><option value="">Todos os assuntos</option>${Object.entries(TIPOS).map(([k, n]) => `<option value="${k}" ${F.tipo === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
  <h2>Por analisar <small style="color:var(--mut);font-weight:400">(${sug.length})</small></h2>
  <div class="list">${(verTodasSug ? sug : sug.slice(0, 15)).map((x, i) => `<div class="row" style="cursor:default"><div class="t"><b>${esc(x.titulo)}</b><small>${esc(x.clube)} · ${esc(x.regiao)}</small>
    <div><span class="tag b">${TIPOS[x.tipo]}</span>${x.prioridade === 'Alta' ? '<span class="tag no">Alta</span>' : ''}</div></div>
    <div class="v">${M ? `<button class="btn sm" data-sg="${d.sugestoes.indexOf(x)}">Abrir caso</button>` : ''}${x.dir_tel ? `<br><a class="tag ok" target="_blank" rel="noopener" href="${wa(x.dir_tel, `Maranata, ${x.dir_nome.split(' ')[0]}! Sobre o clube ${x.clube} (Campori): ${x.titulo}.`)}">WhatsApp</a>` : ''}</div></div>`).join('') || '<div class="alert ok">✅ Nada por analisar.</div>'}</div>
  ${sug.length > 15 ? `<div class="acts"><button class="btn sec" id="vt">${verTodasSug ? 'Mostrar menos' : `Ver todos (${sug.length})`}</button></div>` : ''}
  <h2>Casos</h2><div class="chips">${[['abertos', 'Em aberto'], ['resolvidos', 'Resolvidos'], ['todos', 'Todos']].map(([k, n]) => `<button data-e="${k}" class="${F.estado === k ? 'on' : ''}">${n}</button>`).join('')}</div>
  <div class="list">${cs.map((k) => `<div class="row" data-k="${k.id}"><div class="t"><b>${esc(k.titulo)}</b><small>${esc(k.clube || 'Geral')}${k.regiao ? ' · ' + esc(k.regiao) : ''}${k.responsavel ? ' · 👤 ' + esc(k.responsavel) : ''} · ${dt(k.atualizado_em.slice(0, 10))}${k.notas ? ' · 📝 ' + k.notas : ''}</small>
    <div><span class="tag ${cor[k.estado]}">${k.estado}</span><span class="tag b">${TIPOS[k.tipo] || k.tipo}</span>${k.prioridade === 'Alta' ? '<span class="tag no">Alta</span>' : ''}</div></div></div>`).join('') || '<div class="empty">Sem casos neste filtro.</div>'}</div>
  <div class="acts noprint"><button class="btn sec" id="ex">${IC.csv} Excel (CSV)</button>${M ? `<button class="btn gold" id="io">Importar inscritos oficiais</button>` : ''}</div>`;
  const re = () => render();
  $('#sq').oninput = (e) => { F.q = e.target.value; clearTimeout(el._t); el._t = setTimeout(() => { re(); setTimeout(() => { const b = $('#sq'); if (b) { b.focus(); b.setSelectionRange(99, 99); } }); }, 350); };
  if ($('#sr')) $('#sr').onchange = (e) => { F.reg = e.target.value; re(); };
  $('#st').onchange = (e) => { F.tipo = e.target.value; re(); };
  el.querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => { F.estado = b.dataset.e; re(); }));
  if ($('#vt')) $('#vt').onclick = () => { verTodasSug = !verTodasSug; re(); };
  el.querySelectorAll('[data-sg]').forEach((b) => (b.onclick = () => mNovoCaso(d.sugestoes[+b.dataset.sg])));
  el.querySelectorAll('[data-k]').forEach((r) => (r.onclick = () => mCaso(+r.dataset.k)));
  $('#ex').onclick = () => baixar('secretaria_casos.csv', csv(['Assunto', 'Tipo', 'Clube', 'Região', 'Estado', 'Prioridade', 'Responsável', 'Criado', 'Actualizado'], d.casos.map((k) => [k.titulo, TIPOS[k.tipo] || k.tipo, k.clube, k.regiao, k.estado, k.prioridade, k.responsavel, k.criado_em, k.atualizado_em])));
  if ($('#io')) $('#io').onclick = mImportarOficiais;
  if (M) fab(() => mNovoCaso({}));
};
function mNovoCaso(x) {
  const c = S.clubes.find((y) => y.id === x.clube_id);
  modal(`<h3>${x.titulo ? 'Abrir caso' : 'Novo caso'}</h3><form id="f"><label>Clube</label>${campoClube('qcl', c ? c.nome + ' · ' + c.regiao : '')}<p class="sub" style="margin:4px 0 0">Deixe vazio para um assunto geral.</p>
   <div class="fl"><div><label>Assunto</label><select name="tipo">${Object.entries(TIPOS).map(([k, n]) => `<option value="${k}" ${x.tipo === k ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
   <div><label>Prioridade</label><select name="prioridade"><option ${x.prioridade !== 'Alta' ? 'selected' : ''}>Normal</option><option ${x.prioridade === 'Alta' ? 'selected' : ''}>Alta</option></select></div></div>
   <label>Descrição curta</label><input name="titulo" value="${esc(x.titulo || '')}" required><label>Detalhes</label><textarea name="descricao"></textarea>
   <label>Responsável</label><input name="responsavel" placeholder="Quem vai tratar">
   <div class="acts"><button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Criar caso</button></div></form>`, (m) => {
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const f = e.target, t = $('#qcl', m).value.trim(), cl = t ? clubeDe(t) : null;
      if (t && !cl) return toast('Escolha um clube da lista (ou deixe vazio)', 1);
      try { const r = await api('POST', '/casos', { clube_id: cl?.id, tipo: f.tipo.value, prioridade: f.prioridade.value, titulo: f.titulo.value, descricao: f.descricao.value, responsavel: f.responsavel.value }); toast('Caso criado'); mCaso(r.id); render(); } catch (er) { toast(er.message, 1); } };
  });
}
async function mCaso(id) {
  const k = await api('GET', '/casos/' + id), M = missao();
  modal(`<h3>${esc(k.titulo)}</h3><p class="sub">${esc(k.clube || 'Assunto geral')}${k.regiao ? ' · ' + esc(k.regiao) : ''} · ${TIPOS[k.tipo] || k.tipo} · aberto a ${dt(k.criado_em.slice(0, 10))}</p>
   ${k.descricao ? `<p style="white-space:pre-wrap">${esc(k.descricao)}</p>` : ''}
   <div class="fl"><div><label>Estado</label><select id="ke" ${M ? '' : 'disabled'}>${['Aberto', 'Em curso', 'Resolvido'].map((e) => `<option ${k.estado === e ? 'selected' : ''}>${e}</option>`).join('')}</select></div>
   <div><label>Prioridade</label><select id="kp" ${M ? '' : 'disabled'}>${['Normal', 'Alta'].map((e) => `<option ${k.prioridade === e ? 'selected' : ''}>${e}</option>`).join('')}</select></div></div>
   <label>Responsável</label><input id="kr" value="${esc(k.responsavel)}" ${M ? '' : 'disabled'}>
   <h3 style="margin-top:16px">Historial</h3><div class="list">${k.notas.map((n) => `<div class="card" style="padding:10px"><small style="color:var(--mut)">${esc(n.autor || '')} · ${dt(n.criado_em.slice(0, 10))} ${n.criado_em.slice(11, 16)}</small><div style="white-space:pre-wrap;font-size:14px">${esc(n.texto)}</div></div>`).join('') || '<p class="sub">Sem notas.</p>'}</div>
   ${M ? '<label>Nova nota</label><textarea id="kn" placeholder="Ex.: Liguei ao director, envia a lista até sexta."></textarea>' : ''}
   <div class="acts">${k.dir_tel ? `<a class="btn green" target="_blank" rel="noopener" href="${wa(k.dir_tel, `Maranata, ${k.dir_nome.split(' ')[0]}! Sobre o clube ${k.clube} (Campori): ${k.titulo}.`)}">${IC.wa} Director</a>` : ''}${k.clube_id ? '<button class="btn sec" id="ac">Abrir clube</button>' : ''}</div>
   <div class="acts">${M ? '<button class="btn red" id="kd">Apagar</button>' : ''}<button class="btn sec" id="kf">Fechar</button>${M ? '<button class="btn" id="kg">Guardar</button>' : ''}</div>`, (m) => {
    $('#kf', m).onclick = () => { fechar(); render(); };
    if ($('#ac', m)) $('#ac', m).onclick = () => { S.clube = k.clube_id; st.set('cs_clube', k.clube_id); fechar(); location.hash = '#/clube/painel'; };
    if (!M) return;
    $('#kd', m).onclick = async () => { if (!confirm('Apagar este caso e o historial?')) return; await api('DELETE', '/casos/' + id); fechar(); render(); };
    $('#kg', m).onclick = async () => { try { const n = $('#kn', m).value.trim(); if (n) await api('POST', `/casos/${id}/notas`, { texto: n });
      await api('PUT', '/casos/' + id, { estado: $('#ke', m).value, prioridade: $('#kp', m).value, responsavel: $('#kr', m).value }); toast('Caso actualizado'); mCaso(id); } catch (er) { toast(er.message, 1); } };
  });
}
function mImportarOficiais() {
  modal(`<h3>Inscritos oficiais por clube</h3><p class="sub">CSV com o cabeçalho <b>Região;Clube;Igreja;Inscritos</b> — o número oficial de cada clube (com ou sem lista de nomes). Os clubes que ainda não existem na app (ex.: sem lista) são criados.</p>
   <input type="file" id="fi" accept=".csv,.txt"><p id="pv" class="sub"></p><div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><button class="btn" id="go" disabled>Importar</button></div>`, (m) => {
    let L = [];
    $('#fi', m).onchange = async (e) => { const t = e.target.files[0] && (await e.target.files[0].text()); if (!t) return;
      const R = t.replace(/\r/g, '').split('\n').filter((l) => l.trim()), sep = R[0].includes(';') ? ';' : ',', n = (x) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
      const cab = R[0].split(sep).map(n), ix = (k) => cab.findIndex((h) => h.startsWith(k));
      L = R.slice(1).map((l) => { const v = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); return { regiao: v[ix('regiao')], clube: v[ix('clube')], igreja: ix('igreja') >= 0 ? v[ix('igreja')] : '', inscritos: v[ix('inscrit')] }; });
      $('#pv', m).textContent = `${L.length} clubes · ${L.reduce((a, l) => a + (parseInt(l.inscritos, 10) || 0), 0)} inscritos.`; $('#go', m).disabled = !L.length; };
    $('#go', m).onclick = async () => { try { const r = await api('POST', '/importar-oficiais', { linhas: L }); S.clubes = await api('GET', '/clubes');
      modal(`<h3>Importação concluída</h3><p>✅ ${r.actualizados} clubes actualizados · ${r.clubes_novos} clubes novos (sem lista)</p>${r.erros.length ? `<div class="alert">${r.erros.map(esc).join('<br>')}</div>` : ''}<div class="acts"><button class="btn" onclick="fechar();render()">Ver Secretaria</button></div>`); } catch (e) { toast(e.message, 1); } };
  });
}

// lupa do topo: procurar clubes e pessoas
function mProcurar() {
  modal(`<h3>Procurar</h3><input type="search" id="q" placeholder="Nome do clube, igreja, região ou de uma pessoa…" autocomplete="off"><div id="rq" style="margin-top:10px"></div>
   <div class="acts"><button class="btn sec" onclick="fechar()">Fechar</button></div>`, (m) => {
    const nrm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); let t, pedido = 0;
    const abrir = (cid, sub, pid) => { S.clube = cid; st.set('cs_clube', cid); destaque = pid || 0; fechar(); filtro = ''; location.hash = '#/clube/' + sub; if (rota() === 'clube') render(); };
    const procurar = async () => {
      const q = $('#q', m).value.trim(), meu = ++pedido; if (q.length < 2) { $('#rq', m).innerHTML = '<p class="sub">Escreva pelo menos 2 letras.</p>'; return; }
      const cs = S.clubes.filter((c) => nrm(c.nome + ' ' + c.igreja + ' ' + c.regiao).includes(nrm(q))).slice(0, 8);
      const ps = await api('GET', '/procurar?q=' + encodeURIComponent(q)).catch(() => []); if (meu !== pedido) return;
      $('#rq', m).innerHTML = (cs.length ? `<div class="fase">Clubes</div><div class="list">${cs.map((c) => `<div class="row" data-c="${c.id}"><div class="t"><b>${esc(c.nome)}</b><small>${esc(c.regiao)}${c.igreja ? ' · ' + esc(c.igreja) : ''}</small></div></div>`).join('')}</div>` : '')
        + (ps.length ? `<div class="fase">Pessoas</div><div class="list">${ps.map((p) => `<div class="row" data-p="${p.id}" data-pc="${p.clube_id}"><div class="t"><b>${esc(p.nome)}</b><small>${p.categoria} · ${esc(p.clube)} · ${esc(p.regiao)}</small></div></div>`).join('')}</div>` : '')
        + (!cs.length && !ps.length ? '<p class="sub">Nada encontrado.</p>' : '');
      $('#rq', m).querySelectorAll('[data-c]').forEach((r) => (r.onclick = () => abrir(+r.dataset.c, 'painel')));
      $('#rq', m).querySelectorAll('[data-p]').forEach((r) => (r.onclick = () => abrir(+r.dataset.pc, 'pessoas', +r.dataset.p)));
    };
    $('#q', m).oninput = () => { clearTimeout(t); t = setTimeout(procurar, 250); }; procurar(); $('#q', m).focus();
  });
}
// página de um clube, aberta a partir da lista
V.clube = async (el) => {
  const sub = location.hash.split('/')[2] || 'painel', c = S.clubes.find((x) => x.id === S.clube);
  if (!c) { location.hash = '#/visao'; return; }
  const T = [['painel', 'Painel'], ['pessoas', 'Acampantes'], ...(missao() ? [['fichas', 'Fichas']] : []), ['material', 'Material'], ['tarefas', 'Checklist']];
  el.innerHTML = `<p class="sub noprint" style="margin:0 0 6px"><a href="#/visao">← Clubes</a></p><h1>${esc(c.nome)}</h1><p class="sub">${esc(c.regiao)}${c.igreja ? ' · ' + esc(c.igreja) : ''}${pode() ? '' : ' · só leitura'}</p>
   <div class="clubebar noprint"><span>👤 <b>${esc(c.contacto_nome || 'Sem contacto do director')}</b>${c.contacto_tel ? ' · ' + esc(c.contacto_tel) : ''}</span><span>${botoesContacto(c.contacto_nome, c.contacto_tel, c.nome)} <button class="tag" id="ec">Editar</button></span></div>
   <div class="chips noprint">${T.map(([k, n]) => `<button data-s="${k}" class="${sub === k ? 'on' : ''}">${n}</button>`).join('')}</div><div id="sv"></div>`;
  el.querySelectorAll('[data-s]').forEach((b) => (b.onclick = () => (location.hash = '#/clube/' + b.dataset.s)));
  $('#ec', el).onclick = () => modal(`<h3>Contacto do director · ${esc(c.nome)}</h3><label>Nome</label><input id="cn" value="${esc(c.contacto_nome || '')}"><label>Telefone</label><input id="ct" inputmode="tel" value="${esc(c.contacto_tel || '')}">
    <div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><button class="btn" id="gct">Guardar</button></div>`, (m) => {
    $('#gct', m).onclick = async () => { try { await api('PUT', '/contacto/' + c.id, { nome: $('#cn', m).value, telefone: $('#ct', m).value }); S.clubes = await api('GET', '/clubes'); fechar(); toast('Contacto guardado'); render(); } catch (e) { toast(e.message, 1); } }; });
  const sv = $('#sv', el);
  await (V[sub] || V.painel)(sv);
  const fb = sv.querySelector('.fab'); if (fb) el.append(fb);
  const h = sv.querySelector('h1'); if (h && sub !== 'painel') h.remove();
};
// painel geral da Missão / da região
V.geral = async (el) => {
  const ls = await api('GET', '/visao'), ev = S.me.evento, h = S.me.hoje, M = missao(), f = dias(h, ev.inicio);
  const s = (k, l = ls) => l.reduce((a, c) => a + (c[k] || 0), 0);
  const n = s('n'), dbv = s('dbv'), dir = s('dir'), npd = s('pedidos');
  const regs = {}; for (const c of ls) (regs[c.regiao] ||= []).push(c);
  const att = ALERTAS.map(([k, t, fn]) => [k, k === 'nomes' ? `${t} (${oficiais(ls).sem} nomes em falta)` : t, ls.filter(fn).length]).filter((x) => x[2]);
  const top = [...ls].sort((a, b) => b.n - a.n).slice(0, 5);
  el.innerHTML = `<div class="print-h"><b>${esc(ev.nome)}</b> — Painel geral — ${dt(h)}</div>
  ${npd ? `<div class="alert" style="cursor:pointer" id="vp">📨 <b>${npd} pedido(s)</b> de inclusão/retirada à espera de resposta.</div>` : ''}
  <h1>${M ? 'Missão Sul de Luanda e Cabinda' : 'Região ' + esc(S.me.regiao?.nome || '')}</h1><p class="sub">${esc(ev.nome)}</p>
  <div class="card hero"><small>${f >= 0 ? 'Dias até à partida' : 'Campori a decorrer'}</small><div class="big">${Math.max(0, f)}</div><small>${esc(ev.local)} · ${dt(ev.inicio)} a ${dt(ev.fim)}</small>
   <div class="marcos">${[['Cobrança nos clubes', ev.prazo_cobranca], ['Pagamento do transporte', ev.prazo_transporte], ['Partida', ev.inicio]].map(([t, x]) => { const k = dias(h, x); return `<div class="marco ${k < 0 ? 'feito' : k <= 7 ? 'perto' : ''}"><b>${dt(x)}</b>${t}</div>`; }).join('')}</div></div>
  <div class="grid" style="margin-top:12px">
   <div class="card kpi"><small>Inscritos (oficial)</small><b>${oficiais(ls).of.toLocaleString('pt-PT')}</b><i>${n} com nome na app (${dbv} dbv · ${dir} direcção)${oficiais(ls).sem ? ` · <span style="color:var(--red)">${oficiais(ls).sem} sem nome</span>` : ''}</i></div>
   <div class="card kpi"><small>Clubes</small><b>${ls.length}</b><i>${ls.filter((c) => c.dir_id).length} com director na app</i></div>
   <div class="card kpi ${pct(s('recebido'), s('devido')) >= 80 ? 'green' : 'gold'}"><small>Pagamentos</small><b>${pct(s('recebido'), s('devido'))}%</b><i>${kz(s('recebido'))} de ${kz(s('devido'))}</i></div>
   <div class="card kpi"><small>Com tudo pago</small><b>${s('pagos')}</b><i>de ${n} acampantes</i></div>
  </div>
  <div class="card" style="margin-top:12px">${barra('Pagamentos', pct(s('recebido'), s('devido')))}${barra('Autorizações dos pais', pct(dbv - s('sem_aut'), dbv))}${barra('Fichas médicas', pct(n - s('sem_ficha'), n))}${barra('Fichas individuais completas', pct(s('fichas'), n))}${barra('Material individual (média)', ls.length ? Math.round(s('pct_material') / ls.length) : 0)}${barra('Checklist dos clubes', pct(s('feitas'), s('total')))}${barra('Clubes com director na app', pct(ls.filter((c) => c.dir_id).length, ls.length))}</div>
  <h2>Pontos de atenção</h2>
  <div class="list">${att.map(([k, t, q]) => `<div class="row" data-a="${k}"><div class="t"><b>${esc(t)}</b></div><span class="tag ${['sem_adultos', 'racio', 'pedidos', 'nomes'].includes(k) ? 'no' : 'w'}">${q} clube${q > 1 ? 's' : ''}</span></div>`).join('') || '<div class="alert ok">✅ Nenhum ponto de atenção.</div>'}</div>
  <h2>${M ? 'Por região' : 'Clubes da região'}</h2>
  ${M ? `<div class="list">${Object.entries(regs).sort((a, b) => s('n', b[1]) - s('n', a[1])).map(([r, cs]) => { const pp = pct(s('recebido', cs), s('devido', cs)), pc = pct(s('feitas', cs), s('total', cs));
    return `<div class="row" data-r="${esc(r)}"><div class="t"><b>${esc(r)}</b><small>${cs.length} clubes · ${s('n', cs)} acampantes (${s('dbv', cs)}/${s('dir', cs)}) · ${cs.filter((c) => c.dir_id).length} directores na app</small>
     <div style="display:flex;gap:10px;margin-top:6px"><div style="flex:1"><small style="color:var(--mut)">Pago ${pp}%</small><div class="bar ${pp < 40 ? 'r' : pp < 80 ? 'o' : ''}"><span style="width:${pp}%"></span></div></div><div style="flex:1"><small style="color:var(--mut)">Checklist ${pc}%</small><div class="bar ${pc < 40 ? 'r' : pc < 80 ? 'o' : ''}"><span style="width:${pc}%"></span></div></div></div></div></div>`; }).join('')}</div>`
    : `<div class="acts" style="margin-top:0"><a class="btn sec" href="#/visao">Ver os ${ls.length} clubes</a></div>`}
  <h2>Clubes com mais acampantes</h2>
  <div class="list">${top.map((c, i) => `<div class="row" data-id="${c.id}"><span class="chk" style="border:0;font-weight:800">${i + 1}</span><div class="t"><b>${esc(c.nome)}</b><small>${esc(c.regiao)}</small></div><b>${c.n}</b></div>`).join('')}</div>
  <div class="acts noprint"><button class="btn sec" onclick="print()">${IC.print} Imprimir / PDF</button></div>`;
  el.querySelectorAll('[data-a]').forEach((r) => (r.onclick = () => verClubes('', r.dataset.a)));
  el.querySelectorAll('[data-r]').forEach((r) => (r.onclick = () => verClubes(r.dataset.r, '')));
  el.querySelectorAll('.row[data-id]').forEach((r) => (r.onclick = () => { S.clube = +r.dataset.id; st.set('cs_clube', S.clube); location.hash = '#/clube/painel'; }));
  if ($('#vp')) $('#vp').onclick = mPedidos;
};
async function mPedidos() {
  const ps = await api('GET', '/pedidos'), M = missao();
  modal(`<h3>Pedidos dos clubes</h3><p class="sub">Inscrições fechadas: só a Missão inclui ou retira acampantes.</p>
   <div class="list">${ps.map((x) => `<div class="card"><div style="display:flex;justify-content:space-between;gap:8px"><b>${x.tipo === 'incluir' ? '➕ Incluir' : '➖ Retirar'} ${esc(x.nome)}</b><span class="tag ${x.estado === 'pendente' ? 'w' : x.estado === 'aceite' ? 'ok' : 'no'}">${x.estado}</span></div>
     <small style="color:var(--mut)">${esc(x.clube)} · ${esc(x.regiao)}${x.inscritos_oficial != null ? ` · oficial ${x.inscritos_oficial}, com nome ${x.com_nome}` : ''}${x.estado === 'pendente' && x.inscritos_oficial != null ? `<br><b>${x.tipo === 'retirar' ? 'Ao aceitar: o total do clube desce 1.' : x.inscritos_oficial > x.com_nome ? 'Ao aceitar: preenche um dos inscritos sem nome (o total fica igual).' : 'Ao aceitar: é uma inscrição nova (o total sobe 1).'}</b>` : ''} · ${x.categoria}${x.nascimento ? ' · nasc. ' + dt(x.nascimento) + '/' + x.nascimento.slice(0, 4) : ''} · ${dt(x.criado_em.slice(0, 10))}</small>
     ${x.motivo ? `<p style="margin:6px 0;font-size:14px">${esc(x.motivo)}</p>` : ''}${x.resposta ? `<p class="sub" style="margin:4px 0">Resposta: ${esc(x.resposta)}</p>` : ''}
     ${M && x.estado === 'pendente' ? `<div class="acts" style="margin-top:8px"><button class="btn red sm" data-r="${x.id}">Recusar</button><button class="btn sm" data-a="${x.id}">Aceitar</button></div>` : ''}</div>`).join('') || '<p class="sub">Sem pedidos.</p>'}</div>
   <div class="acts"><button class="btn sec" onclick="fechar();render()">Fechar</button></div>`, (m) => {
    const responder = async (id, acao) => { const resposta = acao === 'recusar' ? prompt('Motivo da recusa (o director vai ver):') ?? '' : '';
      try { await api('PUT', '/pedidos/' + id, { acao, resposta }); toast(acao === 'aceitar' ? 'Pedido aceite' : 'Pedido recusado'); mPedidos(); } catch (e) { toast(e.message, 1); } };
    m.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => responder(b.dataset.a, 'aceitar')));
    m.querySelectorAll('[data-r]').forEach((b) => (b.onclick = () => responder(b.dataset.r, 'recusar')));
  });
}
function mImportarTodos() {
  modal(`<h3>Importar acampantes de todos os clubes</h3><p class="sub">Um CSV com uma linha por pessoa e o cabeçalho:<br><b>Região;Clube;Igreja;Nome;Categoria;Nascimento</b><br>Clubes que não existam são criados. Nomes repetidos no mesmo clube são ignorados.</p>
   <input type="file" id="fi" accept=".csv,.txt"><p id="pv" class="sub"></p><div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><button class="btn" id="go" disabled>Importar</button></div>`, (m) => {
    let L = [];
    $('#fi', m).onchange = async (e) => { const t = e.target.files[0] && (await e.target.files[0].text()); if (!t) return;
      const R = t.replace(/\r/g, '').split('\n').filter((l) => l.trim()), sep = R[0].includes(';') ? ';' : ',', n = (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
      const cab = R[0].split(sep).map(n), ix = (k) => cab.findIndex((h) => h.startsWith(k));
      const I = { regiao: ix('regiao'), clube: ix('clube'), igreja: ix('igreja'), nome: ix('nome'), categoria: Math.max(ix('categ'), ix('func')), nascimento: ix('nasc') };
      L = R.slice(1).map((l, i) => { const v = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); return { linha: i + 2, ...Object.fromEntries(Object.entries(I).map(([k, j]) => [k, j >= 0 ? v[j] || '' : ''])) }; });
      $('#pv', m).textContent = `${L.length} pessoas em ${new Set(L.map((l) => l.regiao + '|' + l.clube)).size} clubes.`; $('#go', m).disabled = !L.length; };
    $('#go', m).onclick = async () => { const b = $('#go', m); b.disabled = true; const T = { criados: 0, repetidos: 0, clubes_novos: 0, erros: [] };
      try { for (let i = 0; i < L.length; i += 300) { b.textContent = `A importar… ${Math.min(i + 300, L.length)}/${L.length}`; const r = await api('POST', '/importar-acampantes', { linhas: L.slice(i, i + 300) }); for (const k of ['criados', 'repetidos', 'clubes_novos']) T[k] += r[k]; T.erros.push(...r.erros); }
        S.clubes = await api('GET', '/clubes');
        modal(`<h3>Importação concluída</h3><p>✅ ${T.criados} acampantes · ${T.clubes_novos} clubes novos · ${T.repetidos} repetidos ignorados</p>${T.erros.length ? `<div class="alert">${T.erros.slice(0, 30).map(esc).join('<br>')}${T.erros.length > 30 ? '<br>…' : ''}</div>` : ''}<div class="acts"><button class="btn" onclick="fechar();render()">Fechar</button></div>`);
      } catch (e) { toast(e.message, 1); b.disabled = false; b.textContent = 'Importar'; } };
  });
}
function mostraSenha(nome, r, tel) {
  modal(`<h3>Acesso de ${esc(nome)}</h3><p>Endereço: <b>${location.host}</b><br>Login: <b>${esc(r.login)}</b><br>Senha provisória: <b style="font-size:22px">${esc(r.senha)}</b></p><p class="sub">No primeiro acesso é pedida uma senha nova.</p>
   <div class="acts"><a class="btn green" target="_blank" rel="noopener" href="${wa(tel, `Maranata, ${nome.split(' ')[0]}!\nO seu acesso ao *Campori 2026*:\n${location.origin}\nLogin: ${r.login}\nSenha: ${r.senha}`)}">${IC.wa} Enviar por WhatsApp</a><button class="btn sec" onclick="fechar();render()">Fechar</button></div>`);
}
function mAcesso(c) {
  modal(`<h3>${esc(c.nome)}</h3><h3 style="margin-top:10px">Contacto do director</h3><p class="sub" style="margin:0">Para contactar o clube, mesmo que o director ainda não use a app.</p>
   <div class="fl"><div><label>Nome</label><input id="cn" value="${esc(c.contacto_nome || c.dir_nome || '')}"></div><div><label>Telefone</label><input id="ct" inputmode="tel" value="${esc(c.contacto_tel || c.dir_tel || '')}"></div></div>
   <div class="acts" style="margin-top:8px">${botoesContacto(c.ct_nome, c.ct_tel, c.nome)}<button class="btn sec sm" id="gct">Guardar contacto</button></div>
   <h3 style="margin-top:18px">Acesso à app</h3>${c.dir_id ? `<p>Director: <b>${esc(c.dir_nome)}</b><br>${esc(c.dir_tel || c.dir_email || '')}</p><div class="acts"><button class="btn gold" id="rs">Repor senha</button></div><h3 style="margin-top:18px">Trocar de director</h3>` : '<p class="sub">Este clube ainda não tem director com acesso.</p>'}
   <form id="f"><label>Nome</label><input name="nome" required value="${c.dir_id ? '' : esc(c.contacto_nome || '')}"><label>Telefone</label><input name="telefone" inputmode="tel" required value="${c.dir_id ? '' : esc(c.contacto_tel || '')}"><div class="acts"><button type="button" class="btn sec" onclick="fechar()">Fechar</button><button class="btn">Criar acesso</button></div></form>
   <h3 style="margin-top:18px">Inscritos oficiais</h3><div style="display:flex;gap:8px"><input id="io" type="number" min="0" inputmode="numeric" value="${c.inscritos_oficial ?? ''}" placeholder="Nº oficial"><button class="btn sec" id="gio">Guardar</button></div>
   <p class="sub">Com nome na app: ${c.n}. A Secretaria compara os dois números.</p>`, (m) => {
    $('#gio', m).onclick = async () => { try { await api('PUT', '/oficial/' + c.id, { inscritos: $('#io', m).value }); toast('Guardado'); } catch (e) { toast(e.message, 1); } };
    $('#gct', m).onclick = async () => { try { await api('PUT', '/contacto/' + c.id, { nome: $('#cn', m).value, telefone: $('#ct', m).value }); S.clubes = await api('GET', '/clubes'); fechar(); toast('Contacto guardado'); render(); } catch (e) { toast(e.message, 1); } };
    if (c.dir_id) $('#rs', m).onclick = async () => { try { mostraSenha(c.dir_nome, await api('POST', `/contas/${c.dir_id}/senha`), c.dir_tel); } catch (e) { toast(e.message, 1); } };
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const b = { nome: e.target.nome.value, telefone: e.target.telefone.value, papel: 'director', clube_id: c.id };
      try { mostraSenha(b.nome, await api('POST', '/contas', b), b.telefone); } catch (er) { toast(er.message, 1); } };
  });
}
function mImportarContactos() {
  modal(`<h3>Importar contactos dos directores</h3><p class="sub">CSV com o cabeçalho <b>Região;Clube;Director;Telefone</b> — uma linha por clube. O nome do clube tem de ser igual ao da app. Não cria acessos à app: só guarda o contacto.</p>
   <input type="file" id="fi" accept=".csv,.txt"><label>…ou cole aqui</label><textarea id="tx" placeholder="Região;Clube;Director;Telefone"></textarea><p id="pv" class="sub"></p>
   <div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><button class="btn" id="go" disabled>Importar</button></div>`, (m) => {
    let L = [];
    const ler = (t) => { const R = t.replace(/\r/g, '').split('\n').filter((l) => l.trim()); if (!R.length) return [];
      const sep = R[0].includes(';') ? ';' : R[0].includes('\t') ? '\t' : ',', n = (x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
      const cab = R[0].split(sep).map(n), ix = (k) => cab.findIndex((h) => h.startsWith(k));
      return R.slice(1).map((l) => { const v = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); return { regiao: v[ix('regiao')], clube: v[ix('clube')], director: ix('director') >= 0 ? v[ix('director')] : (ix('nome') >= 0 ? v[ix('nome')] : ''), telefone: v[Math.max(ix('telefone'), ix('contacto'), ix('tel'))] }; }); };
    const ver = (t) => { L = ler(t); $('#pv', m).textContent = L.length ? `${L.length} clubes prontos a importar.` : ''; $('#go', m).disabled = !L.length; };
    $('#fi', m).onchange = async (e) => e.target.files[0] && ver(await e.target.files[0].text()); $('#tx', m).oninput = (e) => ver(e.target.value);
    $('#go', m).onclick = async () => { try { const r = await api('POST', '/importar-contactos', { linhas: L });
      modal(`<h3>Contactos importados</h3><p>✅ ${r.actualizados} clubes actualizados</p>${r.erros.length ? `<div class="alert">${r.erros.map(esc).join('<br>')}</div>` : ''}<div class="acts"><button class="btn" onclick="fechar();render()">Fechar</button></div>`); } catch (e) { toast(e.message, 1); } };
  });
}
// membros da Coordenação da Missão (cada um com o seu acesso)
async function mCoordenacao() {
  const cs = await api('GET', '/contas?papel=missao');
  modal(`<h3>Coordenação da Missão</h3><p class="sub">Cada membro tem o seu próprio acesso, com os mesmos poderes da Missão: ver e editar todos os clubes, responder a pedidos, Secretaria, avisos, documentos e acessos.</p>
   <div class="list">${cs.map((x) => `<div class="row" style="cursor:default"><div class="t"><b>${esc(x.nome)}</b><small>${esc(x.email || x.telefone || '')}${x.id === S.me.user.id ? ' · (você)' : ''}</small></div>
     <div class="v"><button class="tag b" data-rs="${x.id}">Repor senha</button>${x.id === S.me.user.id ? '' : `<br><button class="tag no" data-x="${x.id}">Retirar acesso</button>`}</div></div>`).join('')}</div>
   <h3 style="margin-top:16px">Novo membro</h3><form id="f"><label>Nome</label><input name="nome" required placeholder="Ex.: Lázaro Romeu">
   <div class="fl"><div><label>Telefone</label><input name="telefone" inputmode="tel" placeholder="9 dígitos"></div><div><label>ou e-mail</label><input name="email" type="email"></div></div>
   <div class="acts"><button type="button" class="btn sec" onclick="fechar()">Fechar</button><button class="btn">Criar acesso</button></div></form>`, (m) => {
    m.querySelectorAll('[data-rs]').forEach((b) => (b.onclick = async () => { const x = cs.find((y) => y.id === +b.dataset.rs); try { mostraSenha(x.nome, await api('POST', `/contas/${x.id}/senha`), x.telefone); } catch (e) { toast(e.message, 1); } }));
    m.querySelectorAll('[data-x]').forEach((b) => (b.onclick = async () => { if (!confirm('Retirar o acesso deste membro da Coordenação?')) return; try { await api('DELETE', '/contas/' + b.dataset.x); toast('Acesso retirado'); mCoordenacao(); } catch (e) { toast(e.message, 1); } }));
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const f = e.target, b = { nome: f.nome.value, telefone: f.telefone.value, email: f.email.value, papel: 'missao' };
      if (!b.telefone.trim() && !b.email.trim()) return toast('Indique o telefone ou o e-mail', 1);
      try { mostraSenha(b.nome, await api('POST', '/contas', b), b.telefone); } catch (er) { toast(er.message, 1); } };
  });
}
async function mRegionais() {
  const [rs, regs] = await Promise.all([api('GET', '/contas'), api('GET', '/regioes')]);
  modal(`<h3>Regionais</h3><div class="list">${rs.map((r) => `<div class="row" style="cursor:default"><div class="t"><b>${esc(r.nome)}</b><small>${esc(r.regiao)} · ${esc(r.telefone || r.email)}</small></div><button class="tag b" data-rs="${r.id}">Repor senha</button></div>`).join('') || '<p class="sub">Ainda sem regionais.</p>'}</div>
   <h3 style="margin-top:16px">Novo regional</h3><form id="f"><label>Nome</label><input name="nome" required><div class="fl"><div><label>Telefone</label><input name="telefone" inputmode="tel" required></div><div><label>Região</label><select name="regiao_id">${regs.map((r) => `<option value="${r.id}">${esc(r.nome)}</option>`).join('')}</select></div></div>
   <div class="acts"><button type="button" class="btn sec" onclick="fechar()">Fechar</button><button class="btn">Criar acesso</button></div></form>`, (m) => {
    m.querySelectorAll('[data-rs]').forEach((b) => (b.onclick = async () => { const r = rs.find((x) => x.id === +b.dataset.rs); mostraSenha(r.nome, await api('POST', `/contas/${r.id}/senha`), r.telefone); }));
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const b = { nome: e.target.nome.value, telefone: e.target.telefone.value, regiao_id: +e.target.regiao_id.value, papel: 'regional' };
      try { mostraSenha(b.nome, await api('POST', '/contas', b), b.telefone); } catch (er) { toast(er.message, 1); } };
  });
}
function lerCSV(t) {
  const L = t.replace(/\r/g, '').split('\n').filter((l) => l.trim()); if (!L.length) return [];
  const sep = L[0].includes(';') ? ';' : L[0].includes('\t') ? '\t' : ',';
  const n = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
  const cab = L[0].split(sep).map(n), col = { regiao: 'regiao', clube: 'clube', igreja: 'igreja', director: 'director', telefone: 'telefone', email: 'email' };
  return L.slice(1).map((l) => { const v = l.split(sep).map((x) => x.trim().replace(/^"|"$/g, '')); return Object.fromEntries(Object.entries(col).map(([k, h]) => [k, v[cab.indexOf(h)] || ''])); });
}
function mImportar() {
  modal(`<h3>Importar clubes</h3><p class="sub">Uma linha por clube, com o cabeçalho:<br><b>Região;Clube;Igreja;Director;Telefone</b><br>Se tiver director e telefone, o acesso é criado logo.</p>
   <input type="file" id="fi" accept=".csv,.txt"><label>…ou cole aqui</label><textarea id="tx" placeholder="Região;Clube;Igreja;Director;Telefone"></textarea><p id="pv" class="sub"></p>
   <div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><button class="btn" id="go" disabled>Importar</button></div>`, (m) => {
    let L = []; const ver = (t) => { L = lerCSV(t); $('#pv', m).textContent = L.length ? `${L.length} linhas prontas a importar.` : ''; $('#go', m).disabled = !L.length; };
    $('#fi', m).onchange = async (e) => e.target.files[0] && ver(await e.target.files[0].text()); $('#tx', m).oninput = (e) => ver(e.target.value);
    $('#go', m).onclick = async () => { try { const r = await api('POST', '/importar', { linhas: L }); S.clubes = await api('GET', '/clubes');
      modal(`<h3>Importação feita</h3><p>✅ ${r.clubes} clubes novos · ${r.acessos.length} acessos criados</p>${r.erros.length ? `<div class="alert">${r.erros.map(esc).join('<br>')}</div>` : ''}${r.acessos.length ? '<p class="sub">As senhas só aparecem agora. Baixe a lista.</p><button class="btn gold" id="cs">Baixar acessos (CSV)</button>' : ''}<div class="acts"><button class="btn sec" onclick="fechar();render()">Fechar</button></div>`,
        (m2) => r.acessos.length && ($('#cs', m2).onclick = () => baixar('acessos_directores.csv', csv(['Nome', 'Clube', 'Login', 'Senha', 'Endereço'], r.acessos.map((a) => [a.nome, a.clube, a.login, a.senha, location.origin]))))); } catch (e) { toast(e.message, 1); } };
  });
}

// ---------- senha ----------
function mSenha(obrig) {
  modal(`<h3>${obrig ? 'Escolha a sua senha' : 'Trocar senha'}</h3>${obrig ? '<p class="sub">Está a usar uma senha provisória.</p>' : `<p class="sub">${esc(S.me.user.nome)} · ${esc(S.me.user.login)}</p>`}
   <form id="f"><label>Senha actual</label><input type="password" name="atual" required><label>Nova senha (mín. 6)</label><input type="password" name="nova" minlength="6" required>
   <div class="acts">${obrig ? '' : '<button type="button" class="btn sec" onclick="fechar()">Cancelar</button>'}<button class="btn">Guardar</button></div></form>`, (m) => {
    if (obrig) m.onclick = null;
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); try { await api('POST', '/me/senha', { atual: e.target.atual.value, nova: e.target.nova.value }); S.me.user.trocar_senha = 0; fechar(); toast('Senha guardada'); } catch (er) { toast(er.message, 1); } };
  });
}
iniciar();
