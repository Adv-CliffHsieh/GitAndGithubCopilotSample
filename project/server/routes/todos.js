import { Router } from 'express';
import db from '../db.js';

const router = Router();

const toTodo = (row) => ({ ...row, done: Boolean(row.done) });

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM todos ORDER BY created_at DESC, id DESC').all();
  res.json({ data: rows.map(toTodo) });
});

router.post('/', (req, res) => {
  const title = (req.body?.title ?? '').trim();
  if (!title) {
    return res.status(400).json({ error: { code: 'INVALID_TITLE', message: 'title 為必填欄位' } });
  }
  const info = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title);
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ data: toTodo(row) });
});

router.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: '找不到該筆 todo' } });
  }
  const title = req.body?.title !== undefined ? String(req.body.title).trim() : row.title;
  if (!title) {
    return res.status(400).json({ error: { code: 'INVALID_TITLE', message: 'title 不可為空' } });
  }
  const done = req.body?.done !== undefined ? (req.body.done ? 1 : 0) : row.done;
  db.prepare('UPDATE todos SET title = ?, done = ? WHERE id = ?').run(title, done, row.id);
  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(row.id);
  res.json({ data: toTodo(updated) });
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: '找不到該筆 todo' } });
  }
  res.status(204).end();
});

export default router;
