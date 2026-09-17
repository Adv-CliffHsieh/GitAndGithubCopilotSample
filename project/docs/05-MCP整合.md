# Phase 5 — MCP 整合：資料庫查詢 + 自動化抓 Bug

## 本階段目標

- 用 SQLite MCP 讓 Copilot 直接查詢資料庫
- 用 Redmine MCP 取得實際的 Bug Issue（選做）
- 用 Playwright MCP 重現一個真實 bug → 修復 → 自動驗證
- 完整體驗 agentic workflow：問題 → 重現 → 修復 → 驗證

## 教學重點

> MCP 讓 agent 有了「手」：能查資料庫、能操作瀏覽器。工具鏈串起來就是自動化 debug 流程

## 前置條件

完成 [Phase 4](04-Hooks.md)；曾經 `npm start` 過（`data/todos.db` 已存在）。

---

## Step 1：啟動 MCP

打開 [.vscode/mcp.json](../.vscode/mcp.json)，點選 `sqlite` 與 `playwright` 的 **Start**。
若要使用 Step 3 的 B 版本，再啟動課程提供的 `redmine` MCP。
在 Copilot Chat 工具清單確認需要的工具已載入。

## Step 2：SQLite MCP — 用嘴查資料庫

先製造一些資料：`npm start` 後在畫面新增幾筆 todo、勾選其中幾筆完成。

然後在 Agent 模式問：

```text
用 SQLite 工具查詢 todos 資料庫：
1. 目前總共有幾筆待辦？幾筆已完成、幾筆未完成？
2. 列出所有未完成的待辦，依建立時間排序。
```

**觀察點**：Copilot 自己寫 SQL、透過 MCP 執行、把結果整理成人話。
它查的是**真實的資料庫**，不是猜的——這是 MCP 與純 LLM 回答的根本差異。

## Step 3：災難現場 — 有使用者回報 Bug！

這一步有兩種做法，請擇一完成。A 版本直接使用預先準備好的使用者回報；B 版本則透過 Redmine MCP 取得真實 Issue，體驗從外部工單開始的 debug 流程。

### A 版本：直接使用使用者回報

> 📣 **使用者回報**：「我按刪除之後，那筆待辦還在畫面上！重新整理才會消失。」

不要自己看程式碼，讓 agent 用完整流程處理。輸入：

```text
使用者回報 bug：在 Todo App 按「刪除」後，該筆項目仍留在畫面上，重新整理後才消失。

請用以下流程處理：
1. 先用 Playwright 開啟 http://localhost:3000，實際操作「新增一筆 → 刪除它」來重現 bug，
   截圖記錄刪除後的畫面狀態
2. 確認重現後，找出前端程式碼的問題並修復
3. 修復後再用 Playwright 重測一次同樣的操作，確認畫面即時更新
4. 最後用 SQLite 工具確認資料庫中該筆資料真的被刪除了
```

（執行前先確認 `npm start` 的 server 還開著）

**觀察這個 agentic workflow 的每一步**：

| 步驟 | 使用的能力 | 對應的教學主題 |
|------|-----------|--------------|
| 開瀏覽器操作、截圖重現 | Playwright MCP | MCP |
| 定位 `public/app.js` 的 `deleteTodo` 少了 `refresh()` | agent 讀碼能力 | — |
| 修復程式碼 | agent 編輯 + skill 規範 | Skills |
| 編輯後自動跑測試 | Phase 4 設定的 hook | Hooks |
| 重測 UI + 查資料庫雙重確認 | Playwright + SQLite MCP | MCP |

一個 prompt，agent 完成了過去要人工來回半小時的 debug 循環。

### B 版本：從 Redmine 取得 Bug（展示）

執行前請確認：

- `redmine` MCP 已啟動，且 Copilot Chat 能看到 Redmine 工具
- Redmine 連線設定、專案名稱或專案 ID 已由課程環境提供
- Todo App 的 `npm start` server 已啟動

在 Agent 模式輸入以下 prompt。請把 `<專案名稱或 ID>` 換成課程提供的值；若課程已指定 Issue ID，也可以直接填入 `<Issue ID>`。

```text
請使用 Redmine 工具處理 Todo App 的 Bug：
1. 在 Redmine 專案「<專案名稱或 ID>」中，搜尋尚未關閉、描述與 Todo App 刪除功能相關的 Bug。
2. 如果找到多筆，選擇最符合「按刪除後，項目仍留在畫面上，重新整理後才消失」的 Issue，並先整理 Issue ID、標題、描述與重現步驟。
3. 如果找不到符合條件的 Issue，請停止並告知我，不要自行猜測 Bug。
4. 確認取得 Issue 後，用 Playwright 開啟 http://localhost:3000，依照 Issue 的重現步驟操作；若步驟不足，補充「新增一筆 → 刪除它」來驗證刪除流程，並截圖記錄結果。
5. 確認重現後，找出前端程式碼的問題並修復。
6. 修復後用 Playwright 重測同一組操作，確認畫面即時更新。
7. 最後用 SQLite 工具確認資料庫中該筆資料真的被刪除了。
8. 回報 Redmine Issue ID、重現結果、修改的檔案、驗證結果，以及仍需要人工確認的事項。
```

**B 版本的重點**：Redmine MCP 負責提供真實的問題脈絡，Playwright 負責重現與驗證，SQLite 負責確認資料狀態；agent 不應在找不到 Issue 時自行捏造需求。

## Step 4：（選做）加碼挑戰

還有時間的話，把整套流程用在新需求上：

```text
幫 Todo App 加上「優先度」功能（高/中/低）：
1. 先用 Stitch 設計優先度標籤在清單中的呈現方式
2. 後端加 priority 欄位與驗證（參考專案 API 規範）
3. 前端實作，補測試
4. 完成後用 Playwright 實際操作驗證，再用 SQLite 查詢確認資料正確寫入
```

這個 prompt 同時動用了：Stitch MCP、skill（API 規範）、hook（自動測試）、Playwright + SQLite MCP——四大主題全部串在一條工作流裡。

---

## ✅ Checkpoint

- [ ] SQLite MCP 能正確回答資料庫統計問題
- [ ] A 版本：Playwright MCP 成功重現「刪除不更新」bug（有截圖）
- [ ] B 版本（選做）：Redmine MCP 成功取得 Bug Issue，並完成重現、修復與驗證
- [ ] Bug 修復後，UI 重測與資料庫確認皆通過
- [ ] `npm test` 全數通過

## 常見問題

**Q：Playwright MCP 第一次執行很慢？**
A：首次會下載瀏覽器。可課前先跑 `npx playwright install chromium` 預熱。

**Q：SQLite MCP 說找不到資料庫？**
A：`data/todos.db` 要先 `npm start` 過才會建立；MCP server 啟動時檔案必須已存在，建好後在 mcp.json 重啟 sqlite server。

**Q：agent 沒重現 bug 就直接改程式碼？**
A：在 prompt 中強調「必須先用 Playwright 重現並截圖，才能開始修改」。流程約束寫得越明確，agent 越守規矩。

**Q：Redmine MCP 找不到 Issue 或專案？**
A：先確認 `redmine` MCP 已啟動，並檢查專案名稱／ID、Issue 權限與連線設定。B 版本找不到符合條件的 Issue 時，應讓 agent 停止回報，不要自行建立或猜測 Bug。

---

🎉 恭喜完成整個 Workshop！回顧 → [README](../README.md)
