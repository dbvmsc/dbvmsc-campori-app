# Campori 2026 — versão simples (v2.4)

Funciona com a mesma tecnologia do SGC: Cloudflare Worker, base de dados D1 e PWA. Tudo no plano gratuito.

## Estrutura (tem de ficar exactamente assim no GitHub)

```
campori-app/
├── public/          ← interface (index.html, app.js, style.css, sw.js, ícones)
├── src/index.js     ← servidor (API)
├── schema.sql       ← base de dados (corre-se uma vez)
├── wrangler.jsonc   ← configuração (precisa do ID da base de dados)
└── package.json
```

`wrangler.jsonc` e `package.json` ficam na raiz do repositório, **não** dentro de outra pasta.

## Instalação (uma vez, ~15 minutos)

1. **Base de dados.** Cloudflare → *Storage & Databases* → *D1* → *Create* → nome: `campori`. Copie o **Database ID**.
2. **Criar as tabelas.** Na base `campori`, separador *Console*: cole todo o conteúdo de `schema.sql` → *Execute*.
3. **GitHub.** Crie o repositório `dbvmsc/campori-app` e carregue os ficheiros com a estrutura acima.
4. **Ligar a base.** No GitHub, abra `wrangler.jsonc` → lápis ✏️ → troque `COLE-AQUI-O-ID-DA-BASE-DE-DADOS` pelo ID do passo 1 → *Commit*.
5. **Publicar.** Cloudflare → *Workers & Pages* → *Create* → *Import a repository* → `campori-app` → *Deploy* (deixe os comandos como estão).
6. **Confirmar.** Abra `https://campori-app.coordenacaodbvmsc1.workers.dev/api/ping`. Tem de mostrar `"versao":"2.4"`.
7. **Primeira conta.** Abra o endereço da app. Aparece *Primeira configuração*: crie a conta da Coordenação da Missão.
8. **Clubes e directores.** *Clubes → Importar clubes e directores* → baixe o modelo, preencha no Excel, grave como CSV e importe. No fim, baixe a lista de acessos (as senhas provisórias só aparecem nesse momento).

## Actualizações futuras

Substitua os ficheiros no GitHub. A Cloudflare publica sozinha em 1–2 minutos. Confirme sempre a versão em `/api/ping`.

**Não volte a correr o `schema.sql` inteiro** numa base com dados: o plano de ação modelo seria recriado. Os dados dos clubes não se perdem, mas não é preciso fazer isso.

## Perfis

- **Director:** Painel, Acampantes (pagamentos, contribuições do clube e documentos marcados na própria pessoa), Pais (mensagens personalizadas por WhatsApp, com modelos editáveis e registo de envios), Material (lista aberta: quem tem o quê) e Checklist de 18 itens.
- **Regional:** vê os clubes da sua região (só leitura).
- **Missão:** vê e edita tudo, importa clubes, cria acessos e repõe senhas.

A importação usa o cabeçalho `Região;Clube;Igreja;Director;Telefone`.
