CREATE TABLE IF NOT EXISTS daily_challenges (
  date TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  exercise_json TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);