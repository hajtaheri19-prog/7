-- MySQL-compatible schema for quotes datasets

CREATE TABLE IF NOT EXISTS quotes (
  id INT PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  tags JSON NULL
);

CREATE TABLE IF NOT EXISTS masters (
  id INT PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  tags JSON NULL
);

CREATE INDEX IF NOT EXISTS idx_quotes_author ON quotes(author);
CREATE INDEX IF NOT EXISTS idx_masters_author ON masters(author);


