# Git 實作練習手冊（待辦清單 To-Do List）

本手冊搭配 [GIT_USAGE_GUIDE.md](GIT_USAGE_GUIDE.md) 使用，透過實作一個待辦清單應用程式，練習 Git 的完整操作流程。

專案目前只有「新增待辦事項」的基礎版本，其餘功能請依照下方 Lab 指示，自己動手加上去，這樣才有真實的變更可以練習 commit。

---

## Lab 0：開始之前

用瀏覽器打開 `index.html`，確認可以輸入文字並按下「新增」，畫面會出現一筆待辦事項。

初始化儲存庫（若尚未初始化）：

```bash
git init
git add .
git commit -m "初始化待辦清單基礎版"
```

---

## Lab 1：基本工作流程（add / commit / push）

1. 打開 `css/style.css`，把 `.app` 的 `max-width` 改成 `520px`。
2. 執行以下指令，觀察每一步的輸出：

```bash
git status
git diff
git add css/style.css
git diff --staged
git commit -m "調整待辦清單版面寬度"
```

3. 若已設定遠端 GitHub 儲存庫，執行 `git push`（第一次需 `git push -u origin main`）。

**VS Code 對照**：Source Control 面板 → 檔案旁按 `+` 暫存 → 輸入訊息 → Commit。

**檢查點**：`git log --oneline` 應該看到兩筆提交（初始化 + 這次調整）。

對應章節：GIT_USAGE_GUIDE.md §4, §5

---

## Lab 2：分支開發與合併

### Lab 2a：切換完成狀態（feature/toggle-complete）

```bash
git switch -c feature/toggle-complete
```

修改 `js/app.js`，在 `render()` 內的迴圈中，把 `list.appendChild(li);` **之前** 加上點擊事件：

```js
li.addEventListener("click", () => {
  todo.completed = !todo.completed;
  save();
  render();
});
li.classList.toggle("completed", todo.completed);
```

測試功能正常後：

```bash
git add js/app.js
git commit -m "新增切換完成狀態功能"
git switch main
git merge feature/toggle-complete
git branch -d feature/toggle-complete
```

### Lab 2b：刪除待辦（feature/delete-todo）

```bash
git switch -c feature/delete-todo
```

在 `js/app.js` 的 `render()` 迴圈中，`list.appendChild(li);` **之前** 加上刪除按鈕：

```js
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "刪除";
deleteBtn.addEventListener("click", () => {
  todos = todos.filter((t) => t.id !== todo.id);
  save();
  render();
});
li.appendChild(deleteBtn);
```

```bash
git add js/app.js
git commit -m "新增刪除待辦功能"
git switch main
git merge feature/delete-todo
git branch -d feature/delete-todo
```

**檢查點**：`git log --oneline --graph --all` 應可看到兩個分支各自合併回 main 的紀錄。

對應章節：GIT_USAGE_GUIDE.md §6, §7, §8

---

## Lab 3：製造並解決合併衝突

這個 Lab 刻意讓兩個分支修改**同一個地方**，讓你實際體驗合併衝突。

### 步驟 1：從 main 建立第一個分支 feature/filter

```bash
git switch main
git switch -c feature/filter
```

修改 `index.html`，把狀態列這一行：

```html
<p id="status-bar">共 0 筆待辦</p>
```

改成：

```html
<p id="status-bar">篩選：全部 / 未完成 / 已完成</p>
```

```bash
git add index.html
git commit -m "狀態列改為顯示篩選選項"
```

**先不要合併**，切回 main，建立第二個分支：

### 步驟 2：從 main 建立第二個分支 feature/counter

```bash
git switch main
git switch -c feature/counter
```

修改**同一行** `<p id="status-bar">共 0 筆待辦</p>`，改成：

```html
<p id="status-bar">剩餘 0 筆未完成</p>
```

```bash
git add index.html
git commit -m "狀態列改為顯示剩餘未完成數量"
```

### 步驟 3：依序合併，觸發衝突

```bash
git switch main
git merge feature/filter
```

這次應該會順利合併（fast-forward 或自動合併）。接著合併第二個分支：

```bash
git merge feature/counter
```

這次 Git 會回報衝突，因為兩個分支都改了同一行。執行：

```bash
git status
```

打開 `index.html`，會看到類似：

```text
<<<<<<< HEAD
<p id="status-bar">篩選：全部 / 未完成 / 已完成</p>
=======
<p id="status-bar">剩餘 0 筆未完成</p>
>>>>>>> feature/counter
```

手動決定保留內容（例如兩者合併為 `<p id="status-bar">篩選：全部 / 未完成 / 已完成｜剩餘 0 筆未完成</p>`），移除衝突標記後：

```bash
git add index.html
git commit
```

**VS Code 對照**：衝突檔案會出現在 Source Control 的 Merge Changes 區域，可用 Accept Current / Accept Incoming / Accept Both 快速處理。

**若想放棄這次合併**：`git merge --abort`

**檢查點**：`git log --oneline --graph --all` 可看到合併節點有兩個父提交（merge commit）。

對應章節：GIT_USAGE_GUIDE.md §9

---

## Lab 4：撤銷與回復

### 4a. 取消尚未暫存的修改

隨意修改 `css/style.css` 一處顏色，不要 `add`，執行：

```bash
git restore css/style.css
```

確認修改被還原。

### 4b. 取消已暫存但尚未提交的修改

```bash
git add css/style.css
git restore --staged css/style.css
```

檔案修改仍在，但已移出暫存區。

### 4c. 修改最後一次提交訊息

```bash
git commit --amend -m "更正過的提交訊息"
```

（限尚未 push 的提交才建議使用）

### 4d. 用 revert 撤銷一個已提交的變更

故意在 `js/app.js` 加入一行錯字（例如把 `render()` 改成 `render(` 少一個括號），提交它：

```bash
git add js/app.js
git commit -m "不小心的錯誤提交"
```

打開瀏覽器確認頁面壞掉後，撤銷這次提交（不刪除歷史）：

```bash
git log --oneline
git revert <剛剛那次提交的 hash>
```

確認頁面恢復正常。

### 4e. Stash 暫存工作

修改 `index.html` 標題文字但先不提交，這時要切去改別的分支：

```bash
git stash push -m "還沒做完的標題修改"
git switch feature/toggle-complete 2>/dev/null || git switch -c temp-branch
git switch main
git stash pop
```

**檢查點**：`git stash list` 在 pop 之前應顯示一筆記錄；pop 後清單應為空。

對應章節：GIT_USAGE_GUIDE.md §10, §11

---

## Lab 5：`.gitignore` 練習

專案已內建 `.gitignore`，包含 `notes.local.txt` 與 `.env`。

1. 建立這兩個檔案：

```bash
echo "這是我的個人筆記" > notes.local.txt
echo "API_KEY=fake-secret-123" > .env
```

2. 執行 `git status`，確認這兩個檔案**不會**出現在未追蹤清單中。

3. 練習「已追蹤檔案」的忽略：先移除 `.gitignore` 中 `notes.local.txt` 那一行，提交 `notes.local.txt`：

```bash
git add notes.local.txt
git commit -m "示範：不小心提交了本地筆記"
```

4. 把 `notes.local.txt` 重新加回 `.gitignore`，並將它從 Git 追蹤中移除（但保留本機檔案）：

```bash
git rm --cached notes.local.txt
git add .gitignore
git commit -m "改為忽略本地筆記檔案"
```

**檢查點**：`git status` 顯示 clean，且 `notes.local.txt` 仍存在於檔案總管中，但 `git log -- notes.local.txt` 顯示曾經被追蹤又移除的歷史。

對應章節：GIT_USAGE_GUIDE.md §12

---

## 完成後的最終檢查

```bash
git log --oneline --graph --decorate --all
```

你應該能看到：主線提交、兩次功能分支合併、一次衝突合併、一次 revert、以及 .gitignore 相關提交，完整走過一次真實的 Git 協作流程。
