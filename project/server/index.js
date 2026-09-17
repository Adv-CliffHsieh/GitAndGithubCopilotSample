import express from 'express';
import todosRouter from './routes/todos.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/api/todos', todosRouter);

const port = process.env.PORT ?? 3000;
// vitest 會自動設定 NODE_ENV=test，測試時不啟動 listener
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Todo App: http://localhost:${port}`));
}

export default app;
