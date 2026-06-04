CREATE TABLE IF NOT EXISTS impocalc_contacts (
  id         INTEGER  PRIMARY KEY AUTOINCREMENT,
  name       TEXT     NOT NULL,
  email      TEXT     NOT NULL,
  phone      TEXT,
  company    TEXT,
  subject    TEXT     NOT NULL,
  message    TEXT     NOT NULL,
  lang       TEXT     NOT NULL DEFAULT 'es',
  created_at TEXT     NOT NULL DEFAULT (datetime('now'))
);
