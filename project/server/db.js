import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

// 測試時以 DB_PATH=:memory: 隔離資料
const dbPath = process.env.DB_PATH ?? 'data/todos.db';
if (dbPath !== ':memory:') {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;
