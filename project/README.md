# GitHub Copilot Workshop — Todo App

用一個 Todo App，半天學會 GitHub Copilot 的四大進階能力：**Skills、Sub Agent、Hooks、MCP**。

## 這個專案是什麼

- 一個可運作的 Todo App：Express 5 + SQLite 後端、原生 HTML/JS 前端、Vitest 測試
- 同時是 workshop 的 **starter repo**：後端已完成，前端是陽春版（還藏了一個 bug 🐛），學員在課程中逐步升級它

## 課程地圖

| 階段 | 講義 | 主題 | 你會做什麼 |
|------|------|------|-----------|
| Phase 0 | [環境準備](docs/00-環境準備.md) | 基礎 | 裝環境、認識 agent mode 與 instructions |
| Phase 1 | [後端 API](docs/01-後端API.md) | Instructions | 體驗 instructions 驅動的規範化產出 |
| Phase 2 | [Stitch 設計與 Sub Agent](docs/02-Stitch設計與SubAgent.md) | **Sub Agent** + MCP 初體驗 | Stitch 產設計稿、sub agent 查規格、改造前端 |
| Phase 3 | [Skills](docs/03-Skills.md) | **Skills** | 觀察 skill 自動觸發、親手寫一個 skill |
| Phase 4 | [Hooks](docs/04-Hooks.md) | **Hooks** | 編輯後自動測試、pre-commit 守門 |
| Phase 5 | [MCP 整合](docs/05-MCP整合.md) | **MCP** | 查資料庫、Playwright 重現 bug 並修復 |

## 建議時程（半天 4 小時）

| 時間 | 內容 |
|------|------|
| 0:00–0:30 | Phase 0 + 1：環境、agent mode、instructions |
| 0:30–1:30 | Phase 2：Stitch + Sub Agent + 前端改造 |
| 1:30–2:15 | Phase 3：Skills |
| 2:15–2:30 | 休息 |
| 2:30–3:10 | Phase 4：Hooks |
| 3:10–4:00 | Phase 5：MCP 整合 + Q&A |

## 快速開始

```bash
npm install
npm test     # 應全數通過
npm start    # http://localhost:3000
```

## 專案結構

```
├── .github/
│   ├── copilot-instructions.md      # 專案級 Copilot 指示（每次對話載入）
│   └── skills/todo-api-style/       # 自訂 skill：API 設計規範（按需載入）
├── .vscode/mcp.json                 # MCP servers：Stitch / SQLite / Playwright
├── docs/                            # 學員步驟講義（Phase 0–5）
├── server/                          # Express + better-sqlite3 後端
├── public/                          # 原生 HTML/JS 前端
├── designs/                         # Stitch 設計稿（Phase 2 產出）
└── tests/                           # Vitest + Supertest API 測試
```

## 講師課前檢查清單

- [ ] `npm install && npm test` 全綠
- [ ] Stitch 帳號可用，OAuth 流程演練過（備案：預先匯出設計稿）
- [ ] `npx playwright install chromium` 預熱瀏覽器下載
- [ ] 確認當前 Copilot 版本的 agent hooks 設定格式（Phase 4）
- [ ] 不要修 `public/app.js` 的刪除 bug——那是 Phase 5 的教材
