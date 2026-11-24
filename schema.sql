-- Campori — versão simples. Correr UMA vez na consola do D1.

CREATE TABLE IF NOT EXISTS regioes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL UNIQUE);

CREATE TABLE IF NOT EXISTS clubes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  regiao_id INTEGER NOT NULL REFERENCES regioes(id),
  nome TEXT NOT NULL, igreja TEXT DEFAULT '', iniciado INTEGER DEFAULT 0,
  UNIQUE(regiao_id, nome)
);

CREATE TABLE IF NOT EXISTS utilizadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL, email TEXT UNIQUE, telefone TEXT UNIQUE,
  senha_hash TEXT NOT NULL, salt TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('missao','regional','director')),
  regiao_id INTEGER REFERENCES regioes(id), clube_id INTEGER REFERENCES clubes(id),
  ativo INTEGER DEFAULT 1, trocar_senha INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessoes (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expira TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS evento (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  nome TEXT, local TEXT, inicio TEXT, fim TEXT,
  taxa_dbv INTEGER, taxa_dir INTEGER, transporte INTEGER,
  prazo_cobranca TEXT, prazo_transporte TEXT, racio_max INTEGER DEFAULT 8
);

CREATE TABLE IF NOT EXISTS tarefa_modelo (ordem INTEGER PRIMARY KEY, fase TEXT, titulo TEXT, dias_antes INTEGER);

CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clube_id INTEGER NOT NULL REFERENCES clubes(id),
  ordem INTEGER NOT NULL, feita INTEGER DEFAULT 0,
  UNIQUE(clube_id, ordem)
);

CREATE TABLE IF NOT EXISTS participantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clube_id INTEGER NOT NULL REFERENCES clubes(id),
  nome TEXT NOT NULL, categoria TEXT DEFAULT 'Desbravador', telefone TEXT DEFAULT '', encarregado TEXT DEFAULT '',
  pago_inscricao INTEGER DEFAULT 0, pago_transporte INTEGER DEFAULT 0,
  autorizacao INTEGER DEFAULT 0, ficha_medica INTEGER DEFAULT 0, obs TEXT DEFAULT ''
);
CREATE INDEX IF NOT EXISTS ix_par ON participantes(clube_id);

-- Contribuições que cada clube decide cobrar (ex.: alimentação, camisola)
CREATE TABLE IF NOT EXISTS contribuicoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT, clube_id INTEGER NOT NULL REFERENCES clubes(id),
  nome TEXT NOT NULL, valor_dbv INTEGER DEFAULT 0, valor_dir INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS contrib_pagas (participante_id INTEGER NOT NULL, contribuicao_id INTEGER NOT NULL, PRIMARY KEY (participante_id, contribuicao_id));

-- Material individual: lista do clube e quem tem cada item
CREATE TABLE IF NOT EXISTS itens (id INTEGER PRIMARY KEY AUTOINCREMENT, clube_id INTEGER NOT NULL REFERENCES clubes(id), nome TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS itens_tem (participante_id INTEGER NOT NULL, item_id INTEGER NOT NULL, PRIMARY KEY (participante_id, item_id));

-- ===== Dados =====
INSERT OR IGNORE INTO evento VALUES (1,'II Campori dos Desbravadores da UNA','Pungo a Ndongo, Malanje','2026-12-28','2027-01-03',5000,8000,22000,'2026-11-29','2026-12-06',8);

INSERT OR IGNORE INTO regioes (nome) VALUES
 ('Belas'),('Cabinda'),('Kilamba'),('Kilamba Kiaxi A'),('Kilamba Kiaxi B'),('Samba e Maianga'),
 ('Talatona Norte'),('Talatona Sul'),('Viana Centro'),('Viana Sul'),('Zango e Icolo e Bengo');

-- Checklist (dias_antes = dias antes da partida; negativo = depois)
INSERT OR REPLACE INTO tarefa_modelo VALUES
 (1,'Inscrição','Confirmar a lista final de acampantes',49),
 (2,'Inscrição','Submeter a inscrição na UNA',48),
 (3,'Inscrição','Reunião com os pais e encarregados',40),
 (4,'Dinheiro e documentos','Cobrar taxas e transporte aos membros',29),
 (5,'Dinheiro e documentos','Pagar o transporte à Missão',22),
 (6,'Dinheiro e documentos','Recolher as autorizações dos pais',14),
 (7,'Dinheiro e documentos','Recolher as fichas médicas',14),
 (8,'Preparação','Verificar tendas, lonas e material de cozinha',21),
 (9,'Preparação','Uniformes de gala e de campo completos',14),
 (10,'Preparação','Ementa e compras de alimentação',10),
 (11,'Preparação','Kit de primeiros socorros, repelente e redes mosquiteiras',10),
 (12,'Preparação','Preparar as provas e apresentações do clube',10),
 (13,'Preparação','Organizar unidades e conselheiros',7),
 (14,'Preparação','Lista de embarque e escala de serviço',4),
 (15,'Durante o Campori','Contagem de acampantes no embarque',0),
 (16,'Durante o Campori','Contagem diária (manhã e noite)',-1),
 (17,'Durante o Campori','Contagem no regresso e entrega aos pais',-6),
 (18,'Depois','Prestação de contas e relatório à região',-14);

-- Canal com os pais: modelos de mensagem do clube e registo de envios
CREATE TABLE IF NOT EXISTS modelos (
  id INTEGER PRIMARY KEY AUTOINCREMENT, clube_id INTEGER NOT NULL REFERENCES clubes(id),
  titulo TEXT NOT NULL, texto TEXT NOT NULL, filtro TEXT DEFAULT 'todos'
);
CREATE TABLE IF NOT EXISTS envios (
  id INTEGER PRIMARY KEY AUTOINCREMENT, clube_id INTEGER NOT NULL, participante_id INTEGER NOT NULL,
  modelo_id INTEGER NOT NULL, em TEXT DEFAULT (datetime('now','+1 hour'))
);
CREATE INDEX IF NOT EXISTS ix_env ON envios(clube_id, modelo_id);
