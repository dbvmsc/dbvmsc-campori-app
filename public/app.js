/* Campori — versão simples */
'use strict';
const VERSAO = '2.4';
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
const pode = () => papel() === 'missao' || (papel() === 'director' && S.clube === S.me.user.clube_id);
const tema = () => (document.documentElement.dataset.tema = st.get('cs_tema') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'));
tema();

// ---------- arranque / login ----------
async function iniciar() {
  if (!S.token) return (await api('GET', '/estado').catch(() => ({ configurado: 1 }))).configurado ? vLogin() : vSetup();
  try { S.me = await api('GET', '/me'); S.clubes = await api('GET', '/clubes'); } catch (e) { return; }
  const g = +st.get('cs_clube');
  S.clube = papel() === 'director' ? S.me.user.clube_id : S.clubes.some((c) => c.id === g) ? g : S.clubes[0]?.id;
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
const rota = () => (location.hash.replace(/^#\/?/, '') || 'painel').split('/')[0];
function abas() {
  const c = [['painel', 'Painel'], ['pessoas', 'Acampantes'], ['material', 'Material'], ['tarefas', 'Checklist']];
  return papel() === 'director' ? [c[0], c[1], ['pais', 'Pais'], c[2], c[3]] : [['visao', 'Clubes'], ...c];
}
function render() {
  if (!S.me) return;
  const r = rota(), u = S.me.user, escuro = document.documentElement.dataset.tema === 'escuro';
  const sel = papel() !== 'director' && S.clubes.length ? `<select id="sc">${S.clubes.map((c) => `<option value="${c.id}" ${c.id === S.clube ? 'selected' : ''}>${esc(c.nome)}</option>`).join('')}</select>` : '';
  $('#app').innerHTML = `${navigator.onLine ? '' : '<div class="off">Sem internet</div>'}
  <header class="top${sel ? " comsel" : ""}"><img class="logo" src="/logo.png" alt=""><div class="tt" id="eu" style="cursor:pointer"><b>Maranata, ${esc(u.nome.split(' ')[0])}</b><small>${esc(S.me.clube?.nome || S.me.regiao?.nome || 'Coordenação da Missão')}</small></div>
   ${sel}<button class="ib" id="bt" title="Tema">${escuro ? IC.sol : IC.lua}</button><button class="sair" id="bs">${IC.sair}<span>Sair</span></button></header>
  <div class="wrap"><nav class="side">${abas().map(([k, n]) => `<a href="#/${k}" class="${r === k ? 'on' : ''}">${IC[k]}${n}</a>`).join('')}<div class="sep">v${VERSAO}</div></nav><main id="main"><div class="empty">A carregar…</div></main></div>
  <nav class="nav">${abas().map(([k, n]) => `<a href="#/${k}" class="${r === k ? 'on' : ''}">${IC[k]}${n}</a>`).join('')}</nav>`;
  $('#bs').onclick = () => sair(); $('#eu').onclick = () => mSenha(false);
  $('#bt').onclick = () => { st.set('cs_tema', escuro ? 'claro' : 'escuro'); tema(); render(); };
  if ($('#sc')) $('#sc').onchange = (e) => { S.clube = +e.target.value; st.set('cs_clube', S.clube); if (rota() === 'visao') location.hash = '#/painel'; else render(); };
  (V[r] || V.painel)($('#main')).catch((e) => ($('#main').innerHTML = `<div class="alert">${esc(e.message)}</div>`));
  scrollTo(0, 0);
}
addEventListener('hashchange', render); addEventListener('online', render); addEventListener('offline', render);
(() => { let x = null, y; // deslizar entre abas
  addEventListener('touchstart', (e) => { x = e.target.closest('.modal,input,select,textarea,.marcos') ? null : e.touches[0].clientX; y = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => { if (x == null || !S.me || !$('#modal').hidden) return; const dx = e.changedTouches[0].clientX - x, dy = e.changedTouches[0].clientY - y; x = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return; const a = abas().map((t) => t[0]), i = a.indexOf(rota()), j = i + (dx < 0 ? 1 : -1); if (i >= 0 && a[j]) location.hash = '#/' + a[j]; }, { passive: true });
})();

function modal(h, fn) { const m = $('#modal'); m.innerHTML = `<div class="sheet">${h}</div>`; m.hidden = false; m.onclick = (e) => e.target === m && fechar(); fn && fn(m); }
function fechar() { $('#modal').hidden = true; $('#modal').innerHTML = ''; }
const ro = () => (pode() ? '' : `<div class="ro">Só leitura: está a ver o clube <b>${esc(S.clubes.find((c) => c.id === S.clube)?.nome)}</b>.</div>`);
const barra = (n, p) => { p = Math.max(0, Math.min(100, p || 0)); return `<div style="margin:8px 0"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${n}</span><b>${p}%</b></div><div class="bar ${p < 40 ? 'r' : p < 80 ? 'o' : ''}"><span style="width:${p}%"></span></div></div>`; };
const fab = (fn) => { const b = document.createElement('button'); b.className = 'fab noprint'; b.innerHTML = IC.mais; b.onclick = fn; $('#main').append(b); };
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

// ---------- PAINEL ----------
V.painel = async (el) => {
  if (!S.clube) return (el.innerHTML = '<div class="empty">Ainda não há clubes.</div>');
  const d = await api('GET', `/c/${S.clube}/painel`), m = d.m, ev = d.evento, f = dias(d.hoje, ev.inicio);
  const txt = `*${ev.nome}*\nClube ${d.clube.nome}\n\n👥 ${m.n} acampantes (${m.dbv} desbravadores, ${m.dir} direcção)\n💰 ${m.pagos} de ${m.n} com tudo pago (${kz(m.recebido)} de ${kz(m.devido)})\n🎒 Material individual ${m.pct_material}%\n📄 Sem autorização: ${m.sem_aut} · Sem ficha médica: ${m.sem_ficha}\n✅ Checklist ${m.feitas}/${m.total}\n⏳ Faltam ${f} dias`;
  el.innerHTML = `<div class="print-h"><b>${esc(ev.nome)}</b> — ${esc(d.clube.nome)} — ${dt(d.hoje)}</div><h1>${esc(d.clube.nome)}</h1><p class="sub">${esc(d.clube.regiao)}</p>${ro()}
  <div class="card hero"><small>${f >= 0 ? 'Dias até à partida' : 'Campori a decorrer'}</small><div class="big">${Math.max(0, f)}</div><small>${esc(ev.local)} · ${dt(ev.inicio)} a ${dt(ev.fim)}</small>
   <div class="marcos">${[['Cobrar aos membros', ev.prazo_cobranca], ['Pagar transporte', ev.prazo_transporte], ['Partida', ev.inicio]].map(([n, x]) => { const k = dias(d.hoje, x); return `<div class="marco ${k < 0 ? 'feito' : k <= 7 ? 'perto' : ''}"><b>${dt(x)}</b>${n}</div>`; }).join('')}</div></div>
  <h2>Alertas</h2>${m.alertas.length ? m.alertas.map((a) => `<div class="alert">⚠️ ${esc(a)}</div>`).join('') : '<div class="alert ok">✅ Tudo em ordem.</div>'}
  <div class="grid">
   <a class="card kpi" href="#/pessoas" style="text-decoration:none"><small>Acampantes</small><b>${m.n}</b><i>${m.dbv} dbv · ${m.dir} direcção</i></a>
   <a class="card kpi ${m.pagos >= m.n && m.n ? 'green' : 'gold'}" href="#/pessoas" style="text-decoration:none"><small>Com tudo pago</small><b>${m.pagos}/${m.n}</b><i>${kz(m.recebido)} de ${kz(m.devido)}</i></a>
  </div>
  <div class="card" style="margin-top:12px">${barra('Pagamentos', m.pct_pago)}${barra('Autorizações dos pais', pct(m.dbv - m.sem_aut, m.dbv))}${barra('Fichas médicas', pct(m.n - m.sem_ficha, m.n))}${barra('Material individual', m.pct_material)}${barra('Checklist', pct(m.feitas, m.total))}</div>
  <p class="sub" style="margin-top:10px">💰 Cada acampante paga: inscrição (${kz(ev.taxa_dbv)} dbv / ${kz(ev.taxa_dir)} direcção) + transporte ${kz(ev.transporte)}${d.contribuicoes.map((k) => ` + ${esc(k.nome)} (${k.valor_dbv === k.valor_dir ? kz(k.valor_dbv) : kz(k.valor_dbv) + ' / ' + kz(k.valor_dir)})`).join('')}.${d.editar ? ' <a href="#/pessoas" id="lc">Contribuições do clube</a>' : ''}</p>
  ${d.proximas.length ? `<h2>A seguir na checklist</h2><div class="list">${d.proximas.map((t) => { const k = dias(d.hoje, t.prazo); return `<a class="row" href="#/tarefas" style="text-decoration:none"><div class="t"><b>${esc(t.titulo)}</b></div><span class="tag ${k < 0 ? 'no' : k <= 7 ? 'w' : 'b'}">${k < 0 ? 'Atrasada' : dt(t.prazo)}</span></a>`; }).join('')}</div>` : ''}
  <div class="acts noprint"><a class="btn green" target="_blank" rel="noopener" href="${wa('', txt)}">${IC.wa} Partilhar no WhatsApp</a></div>`;
  if ($('#lc')) $('#lc').onclick = (e) => { e.preventDefault(); mContrib(); };
};

// ---------- ACAMPANTES ----------
let filtro = '';
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
  <div class="chips">${Object.entries(F).map(([k, [n, f]]) => `<button data-f="${k}" class="${filtro === k ? 'on' : ''}">${n} (${ps.filter(f).length})</button>`).join('')}</div>
  <div class="list">${l.map((p) => { const dv = deve(p, ks);
    return `<div class="row" data-id="${p.id}"><div class="t"><b>${esc(p.nome)}</b><small>${p.categoria}${p.encarregado ? ' · Enc. ' + esc(p.encarregado) : ''}${p.telefone ? ' · ' + esc(p.telefone) : ''}${dv ? ` · <span style="color:var(--red)">deve ${kz(dv)}</span>` : ' · <span style="color:var(--green)">tudo pago</span>'}</small>
     <div>${FL.map(([k, n]) => tag(p[k], n, `data-k="${k}" data-p="${p.id}"`)).join('')}${minhas(ks, p).map((k) => tag(p.pagas.includes(k.id), k.nome, `data-c="${k.id}" data-p="${p.id}"`)).join('')}${DOC.map(([k, n]) => tag(p[k], n, `data-k="${k}" data-p="${p.id}"`)).join('')}</div></div></div>`; }).join('') || '<div class="empty">Ninguém aqui. Toque em + para adicionar.</div>'}</div>
  <div class="acts noprint">${ed ? `<button class="btn gold" id="ct">💰 Contribuições do clube (${ks.length})</button><button class="btn sec" id="il">${IC.csv} Importar lista</button>` : ''}<button class="btn sec" onclick="print()">${IC.print} Imprimir</button><button class="btn sec" id="ex">${IC.csv} Excel (CSV)</button></div>`;
  el.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { filtro = b.dataset.f; render(); }));
  $('#ex').onclick = () => baixar(`acampantes_${nome}.csv`, csv(['Nome', 'Categoria', 'Encarregado', 'Telefone', 'Inscrição', 'Transporte', ...ks.map((k) => k.nome), 'Autorização', 'Ficha médica', 'Deve (Kz)', 'Obs'],
    ps.map((p) => [p.nome, p.categoria, p.encarregado, p.telefone, p.pago_inscricao ? 'Pago' : 'Não', p.pago_transporte ? 'Pago' : 'Não', ...ks.map((k) => (!valorK(k, p) ? '—' : p.pagas.includes(k.id) ? 'Pago' : 'Não')), p.autorizacao ? 'Sim' : 'Não', p.ficha_medica ? 'Sim' : 'Não', deve(p, ks), p.obs])));
  if ($('#ct')) $('#ct').onclick = mContrib;
  if ($('#il')) $('#il').onclick = mImportarLista;
  const marcar = async (url, b) => { try { await api('PUT', url, b); render(); } catch (er) { toast(er.message, 1); } };
  el.querySelectorAll('[data-k]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); if (!ed) return; const p = ps.find((x) => x.id === +b.dataset.p); marcar(`/c/${S.clube}/participantes/${p.id}`, { [b.dataset.k]: p[b.dataset.k] ? 0 : 1 }); }));
  el.querySelectorAll('[data-c]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); if (!ed) return; const p = ps.find((x) => x.id === +b.dataset.p); marcar(`/c/${S.clube}/participantes/${p.id}/contrib/${b.dataset.c}`, { sim: p.pagas.includes(+b.dataset.c) ? 0 : 1 }); }));
  if (!ed) return;
  el.querySelectorAll('.row[data-id]').forEach((r) => (r.onclick = () => mPessoa(ps.find((x) => x.id === +r.dataset.id), ks)));
  fab(() => mPessoa({ categoria: 'Desbravador', pagas: [], itens: [] }, ks));
};
async function mPessoa(p, ks) {
  const its = await api('GET', `/c/${S.clube}/itens`);
  const ck = (n, l, on, v = '') => `<label class="ck"><input type="checkbox" name="${n}" ${v ? `value="${v}"` : ''} ${on ? 'checked' : ''}> ${esc(l)}</label>`;
  modal(`<h3>${p.id ? 'Editar acampante' : 'Novo acampante'}</h3><form id="f">
   <label>Nome completo</label><input name="nome" value="${esc(p.nome)}" required>
   <div class="fl"><div><label>Categoria</label><select name="categoria">${['Desbravador', 'Direção'].map((c) => `<option ${p.categoria === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
   <div><label>Telefone ${p.categoria === 'Direção' ? '' : 'do encarregado'}</label><input name="telefone" inputmode="tel" value="${esc(p.telefone)}"></div></div>
   <label>Nome do encarregado (pai/mãe)</label><input name="encarregado" value="${esc(p.encarregado)}" placeholder="Usado nas mensagens aos pais">
   <label>Já pagou</label><div class="fl">${ck('pago_inscricao', 'Inscrição', p.pago_inscricao)}${ck('pago_transporte', 'Transporte', p.pago_transporte)}${ks.map((k) => ck('pagas', k.nome, p.pagas.includes(k.id), k.id)).join('')}</div>
   <label>Documentos</label><div class="fl">${ck('autorizacao', 'Autorização dos pais', p.autorizacao)}${ck('ficha_medica', 'Ficha médica', p.ficha_medica)}</div>
   <label>Material que já tem</label><div class="fl">${its.map((i) => ck('itens', i.nome, p.itens.includes(i.id), i.id)).join('')}</div>
   <label>Observações (alergias, medicação…)</label><textarea name="obs">${esc(p.obs)}</textarea>
   <div class="acts">${p.id ? '<button type="button" class="btn red" id="del">Apagar</button>' : ''}<button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Guardar</button></div></form>`, (m) => {
    if (p.id) $('#del', m).onclick = async () => { if (!confirm('Apagar ' + p.nome + '?')) return; await api('DELETE', `/c/${S.clube}/participantes/${p.id}`); fechar(); render(); };
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const f = e.target;
      const b = { nome: f.nome.value, categoria: f.categoria.value, telefone: f.telefone.value, encarregado: f.encarregado.value, obs: f.obs.value,
        pagas: [...f.querySelectorAll('[name=pagas]:checked')].map((x) => +x.value), itens: [...f.querySelectorAll('[name=itens]:checked')].map((x) => +x.value) };
      ['pago_inscricao', 'pago_transporte', 'autorizacao', 'ficha_medica'].forEach((k) => (b[k] = f[k].checked ? 1 : 0));
      try { await api(p.id ? 'PUT' : 'POST', `/c/${S.clube}/participantes${p.id ? '/' + p.id : ''}`, b); fechar(); toast('Guardado'); render(); } catch (er) { toast(er.message, 1); } };
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
  let f = st.get('cs_f' + m.id) || m.filtro;
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
    <div class="list">${lst.map((p) => { const q = quando(p); return `<div class="row" data-p="${p.id}"><div class="t"><b>${esc(p.encarregado || 'Encarregado de ' + p.nome.split(' ')[0])}</b><small>${esc(p.nome)} · ${p.telefone ? esc(p.telefone) : '<span style="color:var(--red)">sem telefone</span>'}</small>
      ${q ? `<div><span class="tag ok">✓ Enviada ${dt(q.slice(0, 10))} ${q.slice(11, 16)}</span></div>` : ''}</div>
      ${ed && p.telefone ? `<a class="btn green sm" data-wa="${p.id}" target="_blank" rel="noopener" href="${wa(p.telefone, preencher(m.texto, p, ctx))}">${IC.wa} Enviar</a>` : ''}</div>`; }).join('') || '<div class="empty">Ninguém neste filtro 🎉</div>'}</div>`;
    el.querySelectorAll('[data-f]').forEach((b) => (b.onclick = () => { f = b.dataset.f; st.set('cs_f' + m.id, f); desenhar(); }));
    if ($('#em')) $('#em').onclick = (e) => { e.preventDefault(); mModelo(m); };
    const regista = (pid) => { ctx.en.push({ modelo_id: m.id, participante_id: pid, em: new Date(Date.now() + 3600e3).toISOString().replace('T', ' ').slice(0, 19) }); api('POST', `/c/${S.clube}/envios`, { participante_id: pid, modelo_id: m.id }).catch(() => {}); setTimeout(desenhar, 300); };
    el.querySelectorAll('[data-wa]').forEach((a) => (a.onclick = (e) => { e.stopPropagation(); regista(+a.dataset.wa); }));
    if (ed) el.querySelectorAll('.row[data-p]').forEach((r) => (r.onclick = (e) => { if (e.target.closest('a')) return; const p = ctx.ps.find((x) => x.id === +r.dataset.p);
      modal(`<h3>Mensagem para ${esc(p.encarregado || 'o encarregado de ' + p.nome)}</h3><p class="sub">Pode alterar o texto só para esta pessoa.</p><textarea id="tx" style="min-height:320px">${esc(preencher(m.texto, p, ctx))}</textarea>
        <label>Telefone</label><input id="tl" inputmode="tel" value="${esc(p.telefone)}">
        <div class="acts"><button class="btn sec" onclick="fechar()">Cancelar</button><a class="btn green" id="go" target="_blank" rel="noopener" href="#">${IC.wa} Abrir no WhatsApp</a></div>`, (mm) => {
          const upd = () => ($('#go', mm).href = wa($('#tl', mm).value, $('#tx', mm).value)); upd(); $('#tx', mm).oninput = upd; $('#tl', mm).oninput = upd;
          $('#go', mm).onclick = () => { if (!$('#tl', mm).value.trim()) { toast('Indique o telefone', 1); return false; } fechar(); regista(p.id); };
        }); }));
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
let busca = '', reg = '';
V.visao = async (el) => {
  if (papel() === 'director') return V.painel(el);
  const ls = await api('GET', '/visao'), ev = S.me.evento, M = papel() === 'missao';
  const f = ls.filter((c) => (!reg || c.regiao === reg) && (!busca || c.nome.toLowerCase().includes(busca.toLowerCase()))).sort((a, b) => b.alertas.length - a.alertas.length || a.nome.localeCompare(b.nome));
  const s = (k) => f.reduce((a, c) => a + c[k], 0);
  el.innerHTML = `<h1>Clubes</h1><p class="sub">${M ? 'Toda a Missão' : 'Região ' + esc(S.me.regiao?.nome)} · ${f.length} clubes · faltam ${dias(S.me.hoje, ev.inicio)} dias</p>
  <div class="grid"><div class="card kpi"><small>Acampantes</small><b>${s('n')}</b><i>${s('dbv')} dbv · ${s('dir')} direcção</i></div><div class="card kpi gold"><small>Pago</small><b>${pct(s('recebido'), s('devido'))}%</b><i>${kz(s('recebido'))}</i></div>
   <div class="card kpi"><small>Checklist</small><b>${pct(s('feitas'), s('total'))}%</b></div><div class="card kpi red"><small>Clubes com alertas</small><b>${f.filter((c) => c.alertas.length).length}</b></div></div>
  <div class="tools" style="margin-top:12px"><input type="search" id="bu" placeholder="Procurar clube…" value="${esc(busca)}">${M ? `<select id="rg"><option value="">Todas as regiões</option>${[...new Set(ls.map((c) => c.regiao))].map((r) => `<option ${r === reg ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>` : ''}</div>
  <div class="list">${f.map((c) => `<div class="row" data-id="${c.id}"><div class="t"><b>${esc(c.nome)}</b><small>${esc(c.regiao)} · ${c.n} acamp. · ${c.dir_nome ? esc(c.dir_nome) : '<span style="color:var(--red)">sem director</span>'}</small>
    <div style="display:flex;gap:10px;margin-top:6px"><div style="flex:1"><small style="color:var(--mut)">Pago ${c.pct_pago}%</small><div class="bar ${c.pct_pago < 40 ? 'r' : c.pct_pago < 80 ? 'o' : ''}"><span style="width:${c.pct_pago}%"></span></div></div><div style="flex:1"><small style="color:var(--mut)">Checklist ${pct(c.feitas, c.total)}%</small><div class="bar ${pct(c.feitas, c.total) < 40 ? 'r' : 'o'}"><span style="width:${pct(c.feitas, c.total)}%"></span></div></div></div>
    <div>${c.alertas.map((a) => `<span class="tag no">${esc(a)}</span>`).join('')}</div></div>
    <div class="v">${c.dir_tel ? `<a class="tag ok" target="_blank" rel="noopener" href="${wa(c.dir_tel, `Maranata, ${c.dir_nome.split(' ')[0]}! Sobre o Campori do clube ${c.nome}: `)}">WhatsApp</a>` : ''}${M ? `<br><button class="tag b" data-dir="${c.id}">Acesso</button>` : ''}</div></div>`).join('') || '<div class="empty">Sem clubes.</div>'}</div>
  <div class="acts noprint"><button class="btn sec" id="ex">${IC.csv} Excel (CSV)</button>${M ? '<button class="btn gold" id="im">Importar clubes</button><button class="btn sec" id="rgs">Regionais</button>' : ''}</div>`;
  $('#bu').oninput = (e) => { busca = e.target.value; clearTimeout(el._t); el._t = setTimeout(() => { render(); setTimeout(() => { const b = $('#bu'); b.focus(); b.setSelectionRange(99, 99); }); }, 350); };
  if ($('#rg')) $('#rg').onchange = (e) => { reg = e.target.value; render(); };
  $('#ex').onclick = () => baixar('clubes_campori.csv', csv(['Região', 'Clube', 'Director', 'Telefone', 'Acampantes', 'Desbravadores', 'Direcção', 'Tudo pago', '% pago', 'Sem autorização', 'Sem ficha', '% material', 'Checklist', 'Alertas'], f.map((c) => [c.regiao, c.nome, c.dir_nome, c.dir_tel, c.n, c.dbv, c.dir, c.pagos, c.pct_pago, c.sem_aut, c.sem_ficha, c.pct_material, `${c.feitas}/${c.total}`, c.alertas.join(' | ')])));
  el.querySelectorAll('.row[data-id]').forEach((r) => (r.onclick = (e) => { if (e.target.closest('a,button')) return; S.clube = +r.dataset.id; st.set('cs_clube', S.clube); location.hash = '#/painel'; }));
  el.querySelectorAll('[data-dir]').forEach((b) => (b.onclick = () => mAcesso(ls.find((c) => c.id === +b.dataset.dir))));
  if (M) { $('#im').onclick = mImportar; $('#rgs').onclick = mRegionais; }
};
function mostraSenha(nome, r, tel) {
  modal(`<h3>Acesso de ${esc(nome)}</h3><p>Endereço: <b>${location.host}</b><br>Login: <b>${esc(r.login)}</b><br>Senha provisória: <b style="font-size:22px">${esc(r.senha)}</b></p><p class="sub">No primeiro acesso é pedida uma senha nova.</p>
   <div class="acts"><a class="btn green" target="_blank" rel="noopener" href="${wa(tel, `Maranata, ${nome.split(' ')[0]}!\nO seu acesso ao *Campori 2026*:\n${location.origin}\nLogin: ${r.login}\nSenha: ${r.senha}`)}">${IC.wa} Enviar por WhatsApp</a><button class="btn sec" onclick="fechar();render()">Fechar</button></div>`);
}
function mAcesso(c) {
  modal(`<h3>Acesso · ${esc(c.nome)}</h3>${c.dir_id ? `<p>Director: <b>${esc(c.dir_nome)}</b><br>${esc(c.dir_tel || c.dir_email || '')}</p><div class="acts"><button class="btn gold" id="rs">Repor senha</button></div><h3 style="margin-top:18px">Trocar de director</h3>` : '<p class="sub">Este clube ainda não tem director com acesso.</p>'}
   <form id="f"><label>Nome</label><input name="nome" required><label>Telefone</label><input name="telefone" inputmode="tel" required><div class="acts"><button type="button" class="btn sec" onclick="fechar()">Cancelar</button><button class="btn">Criar acesso</button></div></form>`, (m) => {
    if (c.dir_id) $('#rs', m).onclick = async () => { try { mostraSenha(c.dir_nome, await api('POST', `/contas/${c.dir_id}/senha`), c.dir_tel); } catch (e) { toast(e.message, 1); } };
    $('#f', m).onsubmit = async (e) => { e.preventDefault(); const b = { nome: e.target.nome.value, telefone: e.target.telefone.value, papel: 'director', clube_id: c.id };
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
