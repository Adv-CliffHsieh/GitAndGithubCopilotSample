# Phase 4 — Hooks：幫 Agent 裝上自動守門員

## 本階段目標

- 理解 hooks 的生命週期與用途
- 設定 agent hook：Copilot 編輯檔案後自動跑測試
- 設定 agent hook：Copilot 執行危險工具前要求確認

## 教學重點

> Hook = 在 GitHub Copilot Agent 生命週期的特定時間點自動執行的腳本，不需要 AI「記得」做，而是強制發生

## 前置條件

完成 [Phase 3](03-Skills.md)。

---

## Step 1：Hooks 是什麼？

Skills 與 instructions 是「告訴 AI 該怎麼做」，但 AI 有時會忘。
**Hooks 則是不靠 AI 自覺**——在流程的固定時間點自動觸發：

| Hook 時機 | 說明 | 典型用途 |
|-----------|------|---------|
| `SessionStart` | Agent 工作階段開始 | 載入環境資訊 |
| `PreToolUse` | 工具執行**前** | 擋掉危險指令（如 `rm -rf`） |
| `PostToolUse` | 工具成功執行**後** | 編輯檔案後自動跑測試 / lint |
| `Stop` | Agent 工作階段結束 | 清理、記錄 |

> 完整事件還包含 `UserPromptSubmit`、`PreCompact`、`SubagentStart`、`SubagentStop`，皆屬於 Copilot Agent 生命週期。

## Step 2：設定 agent hook — 編輯後自動測試

在 `.github/hooks/` 建立 workspace hook 設定檔，讓 Copilot 每次**編輯 `server/` 或 `tests/` 的檔案後**自動執行測試。

直接請 Copilot 幫你設定（它會依你目前的 Copilot 版本產生正確格式）：

```text
幫我設定 GitHub Copilot 的 agent hooks：
在 PostToolUse（檔案編輯類工具成功執行後）自動執行 npm test，
只在被編輯的檔案位於 server/ 或 tests/ 時觸發。
請依目前 VS Code / Copilot 支援的 hooks 設定格式建立設定檔。
```

**驗證**：故意讓 Copilot 弄壞程式碼，觀察 hook 自動抓出來。這個驗證分成兩段：

- Hook 負責在檔案編輯完成後自動執行 `npm test`
- Agent 是否會根據失敗結果繼續修正，取決於目前的 Copilot 版本、工作階段與提示詞，不能視為 hook 的保證行為

**1. 確認 hook 設定檔已存在**

檢查 `.github/hooks/` 下已有 Step 2 產生的 JSON 設定檔。若不確定內容是否正確，可貼上：

```text
幫我檢查 .github/hooks/ 內的 hook 設定檔：
確認它監聽 PostToolUse、只在 server/ 或 tests/ 的檔案被編輯時執行 npm test。
```

**2. 請 Copilot 故意改壞程式**

開新的對話，貼上：

```text
把 server/routes/todos.js 裡 GET /:id 找不到資料時回傳的 404 改成 400，
只改狀態碼，不要動測試。
```

> 「不要動測試」是關鍵——這樣測試預期仍是 `404`，改完必定失敗，才能觸發 hook 的價值。

**3. 觀察 hook 自動執行**

Copilot 編輯完 [server/routes/todos.js](../server/routes/todos.js) 後，注意三件事：

1. 不需任何人下指令，`npm test` 自動執行（這就是 `PostToolUse` hook）
2. 測試失敗訊息（預期 `404`、實際收到 `400`）出現在 Agent Logs 或對話紀錄中
3. 如果 agent 沒有自行繼續修正，送出以下追問：

	```text
	請讀取剛才 PostToolUse hook 的 npm test 失敗結果，
	修正 server/routes/todos.js，將 GET /:id 找不到資料時恢復為 404。
	不要修改測試，修正後重新執行 npm test，直到全部通過。
	```

	這時 agent 才會把 `400` 改回 `404`，測試轉綠。這個修正動作是 agent 的後續工作，不是 `PostToolUse` hook 自己完成的。

若想查看 hook 的執行紀錄，可在指令面板（`Cmd+Shift+P`）執行 **Developer: Show Agent Debug Logs**。

**4. 確認程式碼已還原**

貼上以下提示詞收尾：

```text
執行 npm test 確認全部通過，
並確認 server/routes/todos.js 的狀態碼都已恢復原狀。
```

這就是 hooks 的價值：**每次編輯後都會自動得到驗證結果**。至於要不要繼續修正，仍由 agent 或使用者根據結果決定。

**如果沒有看到 `npm test` 自動執行**：

1. 確認目前是在 VS Code 的 Copilot Agent 模式，而不是一般聊天或手動編輯。
2. 確認檔案確實位於 `server/` 或 `tests/`，且編輯工具成功完成。
3. 執行 **Developer: Show Agent Debug Logs**，確認有載入 `.github/hooks/` 下的設定檔，以及是否觸發 `PostToolUse`。
4. 若 hook 有觸發但沒有執行測試，檢查設定檔中的檔案路徑欄位是否符合目前 VS Code / Copilot 版本傳入的事件格式；不同版本的工具事件欄位可能不同。

## Step 3：設定 agent hook — 危險指令執行前確認

建立另一個 `PreToolUse` hook，讓 Copilot 嘗試執行刪除指令時先要求使用者確認。輸入：

```text
幫我設定 GitHub Copilot 的 agent hooks：
在 PreToolUse 偵測終端機工具要執行的指令，
若包含 rm -rf，要求使用者確認後才能繼續。
請建立 `.github/hooks/` 下的設定檔與必要的腳本，
並依目前 VS Code / Copilot 支援的 hooks 設定格式實作。
```

**驗證**：

請 Copilot 嘗試列出一個安全目錄，確認正常執行；再請它提出執行 `rm -rf` 的指令，確認 Agent 在工具執行前出現確認要求。此範例只管理 Copilot Agent 的工具生命週期，不會攔截你手動輸入的終端機指令。

## Step 4：（討論）什麼該放 hook？

和講師討論以下情境該用哪個機制：

| 情境 | instructions / skill / hook？ |
|------|------------------------------|
| 「SQL 要用 prepared statement」 | instructions（風格約定） |
| 「API 欄位命名規範」 | skill（深度規範，按需載入） |
| 「改完程式必須測試通過」 | hook（強制，不靠自覺） |
| 「禁止 agent 執行 rm -rf」 | hook（`PreToolUse` 攔截） |

---

## ✅ Checkpoint

- [ ] agent 編輯後端檔案後，測試自動執行並能在 Agent Logs 中找到結果
- [ ] agent 能根據失敗結果修正程式，或能透過追問完成修正
- [ ] Copilot 執行危險刪除指令前會要求確認
- [ ] 能說出 hooks 與 skills/instructions 的本質差異（強制 vs 建議）

## 常見問題

**Q：hook 裡的 npm test 太慢？**
A：可改為只跑受影響的測試檔，例如 `vitest run tests/todos.test.js`，縮短 `PostToolUse` 的等待時間。

**Q：Hook 會攔截我手動在終端機輸入的指令嗎？**
A：不會。這些 Hook 只在 GitHub Copilot Agent 的生命週期事件中執行；手動 CLI 指令需使用其他機制管理。

---

下一步 → [Phase 5 — MCP 整合](05-MCP整合.md)
