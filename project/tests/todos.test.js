import { describe, it, expect } from 'vitest';
import request from 'supertest';

process.env.DB_PATH = ':memory:';
const { default: app } = await import('../server/index.js');

describe('Todos API', () => {
  it('GET /api/todos 初始為空陣列', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [] });
  });

  it('POST /api/todos 建立成功回傳 201 與資料', async () => {
    const res = await request(app).post('/api/todos').send({ title: '買牛奶' });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ title: '買牛奶', done: false });
    expect(res.body.data.id).toBeTypeOf('number');
  });

  it('POST /api/todos 缺 title 回傳 400 與錯誤格式', async () => {
    const res = await request(app).post('/api/todos').send({ title: '  ' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_TITLE');
  });

  it('PATCH /api/todos/:id 可切換完成狀態', async () => {
    const created = await request(app).post('/api/todos').send({ title: '寫作業' });
    const id = created.body.data.id;

    const res = await request(app).patch(`/api/todos/${id}`).send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.data.done).toBe(true);
  });

  it('PATCH 不存在的 id 回傳 404', async () => {
    const res = await request(app).patch('/api/todos/99999').send({ done: true });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('DELETE /api/todos/:id 刪除成功回傳 204', async () => {
    const created = await request(app).post('/api/todos').send({ title: '待刪除' });
    const id = created.body.data.id;

    const res = await request(app).delete(`/api/todos/${id}`);
    expect(res.status).toBe(204);

    const list = await request(app).get('/api/todos');
    expect(list.body.data.some((t) => t.id === id)).toBe(false);
  });

  it('DELETE 不存在的 id 回傳 404', async () => {
    const res = await request(app).delete('/api/todos/99999');
    expect(res.status).toBe(404);
  });
});
