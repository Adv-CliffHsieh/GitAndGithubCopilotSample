# Phase 2 — Stitch 設計稿 + Sub Agent + 前端改造

## 本階段目標

- 用 Stitch MCP 產生 Todo App 的 UI 設計稿（第一次接觸 MCP）
- 用 Sub Agent 探索並總結後端 API 規格
- 讓 Copilot 依「設計稿 + API 摘要」改造前端

## 教學重點

> MCP 初體驗（外部工具如何變成 Copilot 的能力）、Sub Agent 的 context 隔離、設計稿驅動開發

## 前置條件

完成 [Phase 1](01-後端API.md)；已登入 Google 帳號並可使用 [Stitch](https://stitch.withgoogle.com)。

---

## Step 1：啟用 Stitch MCP

專案已內建 [.vscode/mcp.json](../.vscode/mcp.json)。打開該檔案，VS Code 會在每個 server 上方顯示「Start」按鈕：

1. 點 `stitch` 的 **Start**，依提示完成 Google OAuth 授權
2. 在 Copilot Chat 的工具清單（🔧 圖示）確認 Stitch 工具已出現

> 若 Stitch MCP 的連線方式有異動，請以 [Stitch 官方文件](https://stitch.withgoogle.com) 為準。

## Step 2：用 Stitch 產生設計稿

Agent 模式輸入：

```text
使用 Stitch 幫我設計一個 Todo App 的網頁畫面：
- 風格：清爽、現代、卡片式，主色調藍紫色
- 內容：標題、輸入框與新增按鈕、待辦清單（含勾選框、文字、刪除鈕）、
  已完成項目要有刪除線
- 手機優先的響應式設計
完成後把設計稿的截圖與 HTML/CSS 輸出存到 designs/ 目錄。
```

### 備用方案：沒有 Stitch 時，直接請 AI 產生畫面

如果環境無法使用 Stitch MCP，或 OAuth 授權失敗，也可以直接讓 Copilot 在本地產出一份靜態設計稿，不需要外部工具。

直接在 Agent 模式輸入：

```text
請幫我設計一個 Todo App 的手機版前端畫面，使用 HTML + CSS 直接寫出來，
不需要用任何外部工具或框架。

需求：
- 風格：清爽、現代、卡片式，主色調藍紫色
- 頁面內容：標題、輸入框與新增按鈕、待辦清單、已完成項目帶刪除線
- 請做成響應式設計，手機優先
- 保留元素 id：todo-form、todo-input、todo-list、empty-hint
- 只產生前端畫面，不要寫 JS 邏輯
- 請直接幫我輸出一份可預覽的 HTML/CSS，存到 designs/ 目錄中
```

可選的更明確版本：

```text
請直接幫我建立一個 `designs/todo-mockup.html` 檔案，內容包含完整 HTML + CSS，
讓這個頁面看起來像一個現代 Todo App，使用卡片式佈局、藍紫漸層、圓角、陰影、
待辦項目有勾選框、刪除按鈕與完成狀態樣式，手機自適應，
我之後會拿這份 mockup 當作前端改造依據。
```

這種方式的重點不是依賴 Stitch，而是讓 AI 直接生成可直接參考的畫面草稿。你可以先用這份 mockup 確認版面方向，之後再依照 API 摘要與實際前端邏輯補齊功能。

> 💡 **教學提醒**：這一步的目的是建立「設計意圖」，不是要求 AI 完整實作功能；
> 先把 UI 範本做出來，再讓前端工程師依照它實作真正的互動邏輯。

## Step 3：用 Sub Agent 探索 API 規格

改造前端前，需要先知道後端 API 長怎樣。這次不自己讀，交給 Sub Agent：

```text
#runSubagent 請用 Explore subagent 調查這個專案的後端 API：
列出所有 endpoint、request/response 格式、錯誤格式，
整理成一份給前端工程師看的 API 規格摘要。
```

**觀察點與講解**：

- Sub agent 在**獨立的 context** 中翻遍檔案，主對話只收到最終摘要
- 好處：主對話的 context 不會被大量檔案內容塞爆，重要資訊（設計稿、規格摘要）保持乾淨
- 適用時機：大範圍探索、研究型任務、平行處理多個獨立問題

## Step 4：依設計稿改造前端

現在主 agent 手上有兩份乾淨的輸入：設計稿 + API 摘要。輸入：

```text
依照 designs/ 裡的設計稿，改造 public/ 的前端畫面：
- 只修改 index.html 與 style.css 的視覺與版面
- 不要改動 public/app.js 的任何邏輯
- 保留現有的元素 id（todo-form、todo-input、todo-list、empty-hint）
改完後啟動 server 讓我確認畫面。
```

> ⚠️ 「不要改動 app.js」很重要——裡面藏了一個 Phase 5 要用的教學彩蛋，先別讓 Copilot 順手修掉。

## Step 5：驗收畫面

```bash
npm start
```

打開 <http://localhost:3000>，比對畫面與設計稿。不滿意就繼續跟 agent 迭代：

```text
清單項目的間距太擠，hover 時要有陰影效果，刪除按鈕改成 icon 樣式。
```

---

## ✅ Checkpoint

- [ ] `designs/` 內有 Stitch 產生的設計稿
- [ ] Sub agent 產出 API 規格摘要
- [ ] 前端畫面已依設計稿改版，新增/勾選功能正常
- [ ] `public/app.js` 邏輯未被改動（`git diff public/app.js` 應為空）

## 常見問題

**Q：Stitch MCP 無法連線？**
A：確認已完成 OAuth 授權；公司網路可能擋外部連線，改用手機熱點測試。仍不行就採用備案。

**Q：找不到 sub agent 功能？**
A：不同版本入口不同：可在 prompt 中直接要求「用 subagent 調查…」，或使用 `#runSubagent` 工具引用。

---

下一步 → [Phase 3 — Skills](03-Skills.md)
