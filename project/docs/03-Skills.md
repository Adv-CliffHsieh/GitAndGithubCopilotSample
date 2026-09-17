# Phase 3 — Skills：教會 Copilot 你的團隊規範

## 本階段目標

- 理解 SKILL.md 的結構與觸發機制
- 觀察 skill 在「新增到期日欄位」任務中被自動套用
- 分清 skills、instructions、MCP 三者的差異

## 教學重點

> Skill = 依任務情境「按需載入」的領域知識；description 決定何時被觸發

## 前置條件

完成 [Phase 2](02-Stitch設計與SubAgent.md)。

---

## Step 1：解剖一個 Skill

打開 [.github/skills/todo-api-style/SKILL.md](../.github/skills/todo-api-style/SKILL.md)，注意兩個部分：

```markdown
---
name: todo-api-style
description: Todo App 的 API 設計規範。當新增或修改 /api 路由、todos 資料表欄位…
---

# Todo API 設計規範
（規範本文）
```

| 部分 | 作用 |
|------|------|
| frontmatter `description` | **觸發條件**——Copilot 每次對話都會看到所有 skill 的描述，判斷當前任務是否相關 |
| 本文 | **只在被觸發時**才載入的完整規範 |

> 💡 **與 instructions 的差別**：
> `copilot-instructions.md` 是**每次都全文附上**（適合放少量通用慣例）；
> skill 是**用到才載入**（適合放大量深度規範），不會浪費 context。

## Step 2：觸發 Skill — 新增到期日功能

Agent 模式輸入一個**完全沒提到規範**的需求：

```text
幫 Todo App 加上「到期日」功能：
- todos 資料表加 due_date 欄位
- API 支援建立與更新到期日
- 前端新增時可選填日期，清單顯示到期日，過期的項目標紅
- 補上對應測試並執行 npm test
```

**觀察點**（這是本階段的核心 demo）：

1. 執行過程中 Copilot 會顯示讀取了 `todo-api-style` skill
2. 檢查產出：
   - `due_date` 用 snake_case？✅（skill 規定）
   - 日期驗證失敗回 `INVALID_DUE_DATE`？✅（skill 錯誤代碼表）
   - 用 `ALTER TABLE ... ADD COLUMN` 且防重複執行？✅（skill 欄位規範）
   - 自動補了成功 + 失敗 + 404 測試？✅（skill 測試要求）

你的 prompt 一個字都沒提這些細節，全部來自 skill。

## Step 3：親手寫一個 Skill

換你了。建立一個「commit message 規範」的 skill：

```text
在 .github/skills/commit-style/SKILL.md 建立一個 skill：
- description 寫明：產生 git commit message 或執行 git commit 時使用
- 規範：Conventional Commits 格式（feat/fix/docs/refactor/test/chore）、
  標題用繁體中文、不超過 50 字、body 條列變更重點
```

建立後測試觸發：

```text
幫我把目前的變更 commit，訊息依專案規範。
```

觀察 commit message 是否符合你剛定義的格式。

## Step 4：三兄弟比一比

| | instructions | skills | MCP |
|--|--|--|--|
| 本質 | 靜態文字規範 | 按需載入的知識包 | 外部工具/能力 |
| 載入時機 | 每次對話 | 任務相關才載入 | agent 呼叫工具時 |
| 適合放 | 通用慣例、技術棧 | 深度規範、SOP、範例 | 資料庫查詢、瀏覽器、外部服務 |
| 本專案範例 | copilot-instructions.md | todo-api-style | Stitch / SQLite / Playwright |

---

## ✅ Checkpoint

- [ ] 到期日功能完成，`npm test` 全數通過
- [ ] 能指出產出程式碼中哪些細節來自 skill（而非 prompt）
- [ ] 自己寫的 commit-style skill 能被觸發

## 常見問題

**Q：Skill 沒有被觸發？**
A：description 要寫得像「使用情境說明」而不是一句標題。把「什麼時候該用我」寫清楚（動詞 + 對象 + 情境），觸發率才高。

**Q：規範該放 instructions 還是 skill？**
A：問自己「每次對話都需要嗎？」需要 → instructions；只有特定任務需要 → skill。

---

下一步 → [Phase 4 — Hooks](04-Hooks.md)
