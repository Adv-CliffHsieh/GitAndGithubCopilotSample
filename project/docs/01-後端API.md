# Phase 1 — 後端 API：instructions 驅動開發

## 本階段目標

- 理解後端 CRUD API 的結構與統一回應格式
- 體驗 instructions 如何讓 Copilot 產出「符合團隊規範」的程式碼
- 用 Copilot 完成第一個修改任務

## 教學重點

> `copilot-instructions.md` 如何約束 Copilot 的產出風格；測試驅動的修改流程

## 前置條件

完成 [Phase 0](00-環境準備.md)，`npm test` 全綠。

---

## Step 1：用 Copilot 理解後端

Agent 模式輸入：

```text
請解釋 server/routes/todos.js 的四個 endpoint：
1. 每個 endpoint 的成功與失敗回應格式
2. 為什麼 done 欄位在資料庫和 API 回應的型別不同？
3. 這裡的 SQL 寫法如何防止 SQL injection？
```

**觀察點**：Copilot 回答的「統一回應格式 `{ data }` / `{ error }`」正是 instructions 與 skill 中定義的規範。

## Step 2：實驗 — instructions 的威力

做一個對照實驗。Agent 模式輸入：

```text
在 server/routes/todos.js 新增一個 GET /api/todos/:id endpoint，回傳單筆 todo。
```

完成後檢查產出的程式碼：

- ✅ 回應是否用了 `{ data: ... }` 信封格式？
- ✅ 找不到時是否回傳 `404` + `{ error: { code: 'NOT_FOUND', ... } }`？
- ✅ SQL 是否使用 prepared statement？

你**沒有**在 prompt 裡提到任何格式要求，但 Copilot 全部做對了——因為 instructions 檔一直都在上下文中。

## Step 3：讓 Copilot 補測試

```text
為剛剛新增的 GET /api/todos/:id 補上測試：成功取得單筆、以及 id 不存在回傳 404。
完成後執行 npm test 確認全部通過。
```

**觀察點**：Agent 模式會自己跑 `npm test` 驗證，失敗會自己修——這是 agent 與傳統補全最大的差異。

## Step 4：（選做）從零重建後端的 prompt

如果你想課後從空專案練習，這是能產出整個後端的 prompt 範例：

```text
建立一個 Express + better-sqlite3 的 Todo API：
- 資料表 todos：id、title、done、created_at
- CRUD 四支 endpoint 掛在 /api/todos
- 回應格式：成功 { data }，失敗 { error: { code, message } }
- 用 vitest + supertest 寫測試，測試用 :memory: 資料庫
- express.static 服務 public/ 目錄
```

---

## ✅ Checkpoint

- [ ] 新增的 `GET /api/todos/:id` 符合回應格式規範
- [ ] 新測試已加入且 `npm test` 全數通過
- [ ] 能說出「為什麼 Copilot 知道要用 `{ data }` 格式」

## 常見問題

**Q：Copilot 產出的格式不符合規範？**
A：檢查 `.github/copilot-instructions.md` 是否存在。也可以在 prompt 中明確要求「遵守專案的 API 規範」提醒它。

**Q：Agent 改壞了原本的程式碼？**
A：每次 agent 執行後 VS Code 都有變更預覽，可逐檔 Keep/Undo。養成先看 diff 再接受的習慣。

---

下一步 → [Phase 2 — Stitch 設計與 Sub Agent](02-Stitch設計與SubAgent.md)
