---
name: todo-api-style
description: Todo App 的 API 設計規範。當新增或修改 /api 路由、todos 資料表欄位、API 回應格式或錯誤處理時，必須套用此規範。適用情境包含：新增 API 欄位（如到期日、優先度）、新增 endpoint、調整回應結構、撰寫 API 測試。
---

# Todo API 設計規範

## 回應格式（Response Envelope）

所有 API 回應必須使用統一信封格式：

**成功**：

```json
{ "data": { ... } }
```

- 列表回傳 `{ "data": [ ... ] }`
- 建立成功回傳 `201` + `{ "data": {...} }`
- 刪除成功回傳 `204`，無 body

**失敗**：

```json
{ "error": { "code": "ERROR_CODE", "message": "繁體中文說明" } }
```

## 錯誤代碼

| HTTP | code | 使用時機 |
|------|------|---------|
| 400 | `INVALID_TITLE` | title 缺少或為空白 |
| 400 | `INVALID_DUE_DATE` | 到期日格式錯誤（非 YYYY-MM-DD） |
| 400 | `INVALID_PRIORITY` | 優先度不在允許清單內 |
| 404 | `NOT_FOUND` | 指定 id 的資源不存在 |

新增欄位時，依 `INVALID_<欄位名大寫>` 命名新的錯誤代碼並補進此表。

## 欄位規範

- 欄位命名使用 snake_case（如 `created_at`、`due_date`）
- 布林值在資料庫存 INTEGER 0/1，回應時轉為 JSON boolean
- 日期欄位使用 TEXT 存 ISO 格式（`YYYY-MM-DD` 或 datetime）
- 新增欄位使用 `ALTER TABLE ... ADD COLUMN`，並用 try/catch 或欄位檢查避免重複執行報錯

## 路由規範

- 路由掛在 `/api/todos`，遵循 REST：GET（列表）、POST（建立）、PATCH `/:id`（部分更新）、DELETE `/:id`
- PATCH 只更新 body 中有提供的欄位，未提供的欄位保持原值
- 一律使用 prepared statement，禁止字串拼接 SQL

## 測試要求

新增或修改 API 時，必須同步在 `tests/todos.test.js` 加上：

1. 成功案例（驗證回應格式與資料）
2. 驗證失敗案例（錯誤 code 正確）
3. 404 案例（若適用）
