# Todo App 專案指引

這是一個 GitHub Copilot 教學用的 Todo App 專案。

## 技術棧

- 後端：Node.js + Express 5（ESM，`"type": "module"`）
- 資料庫：SQLite（better-sqlite3，同步 API）
- 前端：純 HTML / CSS / JavaScript，不使用任何框架
- 測試：Vitest + Supertest

## 專案結構

- `server/index.js`：Express 進入點，export app 供測試使用
- `server/db.js`：SQLite 連線與資料表初始化
- `server/routes/todos.js`：Todos CRUD 路由
- `public/`：前端靜態檔案
- `tests/`：API 測試

## 程式碼慣例

- 使用 ESM `import`/`export`，不使用 CommonJS `require`
- SQL 一律使用 prepared statement（`db.prepare(...)`），禁止字串拼接 SQL
- 前端使用 `fetch` 呼叫 API，DOM 操作使用原生 API
- 變數與函式命名使用 camelCase，常數使用 UPPER_SNAKE_CASE
- 使用者可見文字（UI、錯誤訊息）使用繁體中文

## API 慣例

API 回應格式與錯誤處理規範定義於 `.github/skills/todo-api-style/SKILL.md`，
新增或修改任何 `/api` 路由時必須遵守。

## 測試

- 每支 API endpoint 都要有對應測試（成功 + 失敗案例）
- 測試使用 `DB_PATH=:memory:` 隔離資料
- 修改後端程式後執行 `npm test` 確認全數通過
