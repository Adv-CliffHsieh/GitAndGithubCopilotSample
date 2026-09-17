# Git 使用手冊

本手冊整理 Git 的基本操作，適合日常開發與團隊協作使用。

## 1. Git 是什麼？

Git 是分散式版本控制系統，可以記錄檔案變更、建立分支、多人協作，以及在需要時回復到過去的版本。

常見概念：

- **Repository（儲存庫）**：存放專案與版本紀錄的地方。
- **Working tree（工作區）**：目前正在編輯的檔案。
- **Staging area（暫存區）**：準備納入下一次提交的變更。
- **Commit（提交）**：將一組變更保存成版本。
- **Branch（分支）**：從主要開發線分出的獨立工作線。
- **Remote（遠端儲存庫）**：例如 GitHub、GitLab 或 Bitbucket 上的儲存庫。

## 2. 安裝與初始設定

確認 Git 是否已安裝：

```bash
git --version
```

設定提交時使用的姓名與電子郵件：

```bash
git config --global user.name "你的姓名"
git config --global user.email "you@example.com"
```

查看目前設定：

```bash
git config --global --list
```

建議設定預設分支名稱：

```bash
git config --global init.defaultBranch main
```

## 3. 建立或取得專案

### 建立新的 Git 儲存庫

在專案資料夾中執行：

```bash
git init
```

### 複製遠端儲存庫

```bash
git clone <遠端儲存庫網址>
cd <專案資料夾>
```

例如：

```bash
git clone https://github.com/example/project.git
```

### 在 VS Code 中建立或複製專案

- 開啟 **Source Control** 面板，選擇 **Initialize Repository**，即可在目前資料夾建立儲存庫。
- 選擇 **Clone Repository**，貼上遠端儲存庫網址，再選擇本機儲存位置。
- 也可以使用命令選擇區執行 **Git: Clone**。

## 4. 查看目前狀態

```bash
git status
```

查看檔案差異：

```bash
# 查看尚未加入暫存區的差異
git diff

# 查看已加入暫存區、尚未提交的差異
git diff --staged
```

查看提交紀錄：

```bash
git log --oneline --graph --decorate --all
```

### 在 VS Code 中查看狀態與差異

- 點選左側活動列的 **Source Control** 圖示，查看變更檔案與目前分支。
- 點選檔案名稱，可以開啟 VS Code 的差異檢視器，比較修改前後的內容。
- 在檔案上按右鍵，可選擇 **Discard Changes** 捨棄尚未提交的修改。
- 使用命令選擇區執行 **Git: View History**，或安裝 Git 歷史檢視擴充功能查看提交紀錄。

## 5. 標準工作流程

每次完成一個小功能或修正時，可以依照以下流程：

```bash
# 1. 查看變更
git status

# 2. 將指定檔案加入暫存區
git add path/to/file

# 或加入所有變更
git add .

# 3. 再次確認即將提交的內容
git diff --staged

# 4. 建立提交
git commit -m "描述這次變更"

# 5. 推送到遠端
git push
```

### 在 VS Code 中完成標準流程

1. 點選左側 **Source Control** 圖示。
2. 在變更檔案旁按 **+**，將指定檔案加入暫存區；也可以按變更區塊旁的 **+**。
3. 在訊息欄輸入提交訊息。
4. 點選 **Commit**，或使用 **Commit & Push** 同時提交並推送。
5. 點選 **Sync Changes**，同步本地與遠端提交。

### 提交訊息建議

提交訊息應簡短、明確，描述「做了什麼」：

```text
新增使用者登入功能
修正購物車總金額計算
更新 Git 使用手冊
```

避免使用沒有資訊量的訊息：

```text
update
fix
test
```

## 6. 分支操作

查看本地分支：

```bash
git branch
```

查看本地與遠端分支：

```bash
git branch -a
```

建立並切換到新分支：

```bash
git switch -c feature/login
```

切換分支：

```bash
git switch main
```

刪除已合併的本地分支：

```bash
git branch -d feature/login
```

將目前分支推送到遠端並建立追蹤關係：

```bash
git push -u origin feature/login
```

### 在 VS Code 中操作分支

- 點選視窗左下角的分支名稱，開啟分支選單。
- 選擇 **Create new branch...** 建立並切換到新分支。
- 選擇 **Checkout to...** 切換到其他本地或遠端分支。
- 選擇 **Publish Branch**，將目前分支首次推送到遠端。
- 在分支選單中選擇分支後的刪除選項，可刪除已合併的本地分支。

### 分支命名建議

```text
feature/功能名稱
fix/問題名稱
refactor/重構內容
docs/文件內容
chore/維護工作
```

## 7. 與遠端儲存庫同步

取得遠端資訊但不修改目前分支：

```bash
git fetch origin
```

拉取遠端變更並合併到目前分支：

```bash
git pull
```

將本地提交推送到遠端：

```bash
git push
```

第一次推送新分支時：

```bash
git push -u origin <分支名稱>
```

建議在開始工作前先同步主要分支：

```bash
git switch main
git pull --ff-only
```

### 在 VS Code 中同步遠端

- 點選左下角的分支名稱，選擇 **Fetch** 取得遠端最新資訊。
- 使用命令選擇區執行 **Git: Pull**，拉取並合併遠端變更。
- 點選狀態列的同步圖示，或在 Source Control 面板選擇 **Sync Changes**。
- 若只想推送本地提交，可在 Source Control 面板選擇 **Push**。

## 8. 合併分支

將功能分支合併到 `main`：

```bash
git switch main
git pull --ff-only
git merge feature/login
git push
```

合併前應確認：

- 工作區沒有未提交的變更。
- 目前已取得遠端最新版本。
- 功能分支已完成測試。
- 提交內容沒有包含密碼、金鑰或其他機密資料。

### 在 VS Code 中合併分支

1. 點選左下角分支名稱，切換到 `main`。
2. 再次開啟分支選單，選擇 **Merge Branch...**。
3. 選取要合併的功能分支。
4. 確認合併結果後，在 Source Control 面板提交並推送。

## 9. 處理合併衝突

當 Git 顯示衝突時：

```bash
git status
```

開啟衝突檔案，尋找以下標記並手動保留正確內容：

```text
<<<<<<< HEAD
目前分支的內容
=======
另一個分支的內容
>>>>>>> other-branch
```

完成修改後：

```bash
git add <已解決的檔案>
git commit
```

如果想取消本次合併：

```bash
git merge --abort
```

### 在 VS Code 中處理合併衝突

- Source Control 面板會將衝突檔案列在 **Merge Changes** 區域。
- 開啟衝突檔案後，使用 **Accept Current Change**、**Accept Incoming Change**、**Accept Both Changes** 或直接編輯內容。
- 確認檔案內容後，按檔案旁的 **+** 標記為已解決，再完成提交。
- 若要取消合併，可開啟命令選擇區執行 **Git: Abort Merge**。

## 10. 撤銷與回復操作

### 取消工作區尚未加入暫存區的修改

```bash
git restore <檔案>
```

### 將檔案移出暫存區，但保留修改內容

```bash
git restore --staged <檔案>
```

### 修改最後一次提交訊息

```bash
git commit --amend -m "新的提交訊息"
```

只有在尚未推送，或團隊已同意改寫歷史時，才使用 `--amend`。

### 建立反向提交以撤銷既有提交

```bash
git revert <commit-hash>
```

這是已推送提交較安全的撤銷方式，因為它不會刪除既有歷史。

### 回到特定提交並捨棄後續修改

```bash
git reset --hard <commit-hash>
```

`reset --hard` 可能造成資料遺失。執行前應確認變更已備份，且不要對其他人正在使用的共享分支任意改寫歷史。

### 在 VS Code 中撤銷與回復

- Source Control 面板中，對尚未暫存的檔案按右鍵並選擇 **Discard Changes**。
- 對已暫存檔案按右鍵並選擇 **Unstage Changes**，保留修改但移出暫存區。
- 使用命令選擇區執行 **Git: Undo Last Commit**，可撤銷最近一次提交但保留檔案修改。
- 對已推送的提交，建議透過終端機執行 `git revert`，避免改寫共享歷史。

## 11. 暫存尚未完成的工作

需要切換分支但目前工作尚未完成時，可以使用 stash：

```bash
git stash push -m "暫存中的工作"
git switch main
```

查看 stash：

```bash
git stash list
```

取回最近一次 stash：

```bash
git stash pop
```

### 在 VS Code 中使用 stash

1. 開啟命令選擇區，執行 **Git: Stash** 暫存目前修改。
2. 執行 **Git: Stash Pop** 取回最近一次暫存。
3. 若要選擇特定暫存內容，可執行 **Git: Apply Stash...**。

## 12. `.gitignore`

使用 `.gitignore` 排除不應提交的檔案，例如：

```gitignore
# 作業系統檔案
.DS_Store

# 編輯器設定
.vscode/

# 依賴套件
node_modules/

# 建置產物
dist/
build/

# 環境變數與機密設定
.env
.env.*
```

`.gitignore` 只能阻止尚未被 Git 追蹤的檔案。若檔案已經被追蹤，需要先移除索引中的檔案：

```bash
git rm --cached <檔案>
```

### 在 VS Code 中管理 `.gitignore`

- 在檔案總管建立或開啟 `.gitignore`，直接加入要忽略的檔案或資料夾規則。
- 若檔案尚未被 Git 追蹤，儲存 `.gitignore` 後，它會從 Source Control 的變更清單中消失。
- 若檔案已經被追蹤，請使用 VS Code 內建終端機執行上方的 `git rm --cached` 指令。

## 13. 查看與搜尋歷史

查看特定提交內容：

```bash
git show <commit-hash>
```

依提交訊息搜尋：

```bash
git log --oneline --grep="關鍵字"
```

查看某檔案的修改歷史：

```bash
git log -- path/to/file
```

查看每一行最後由哪個提交修改：

```bash
git blame path/to/file
```

### 在 VS Code 中查看歷史

- 在檔案總管對檔案按右鍵，選擇 **Open Timeline**，查看該檔案的修改紀錄。
- 點選 Source Control 面板中的提交紀錄，可查看提交內容與檔案差異。
- 若需要完整的分支圖、檔案歷史或 blame 資訊，可使用命令選擇區或安裝 Git 歷史檢視擴充功能。

## 14. 常見問題

### 推送時被拒絕

通常是遠端有本地尚未取得的提交：

```bash
git pull --rebase
# 解決衝突並完成 rebase 後
git push
```

### 想確認遠端網址

```bash
git remote -v
```

### 想更換遠端網址

```bash
git remote set-url origin <新的遠端網址>
```

### 在 VS Code 中查看與修改遠端

- 開啟命令選擇區，執行 **Git: Add Remote** 新增遠端儲存庫。
- 執行 **Git: Remove Remote** 移除遠端設定。
- 若要修改既有遠端網址，建議在 VS Code 內建終端機執行上方的 `git remote set-url` 指令。

### 不小心把檔案加入暫存區

```bash
git restore --staged <檔案>
```

### 不小心提交了敏感資訊

先立即撤銷憑證，例如密碼或 API 金鑰，再依團隊流程清理 Git 歷史。單純刪除檔案並重新提交，並不能保證敏感資訊已從歷史中移除。

## 15. 建議的團隊協作規則

1. 一個提交盡量只處理一件事情。
2. 提交前先檢查 `git diff` 與 `git status`。
3. 不要提交密碼、私鑰、API 金鑰或個人環境設定。
4. 功能開發使用獨立分支，不直接在 `main` 上開發。
5. 合併前執行測試與程式碼檢查。
6. 不要在未確認的情況下對共享分支使用 `git push --force`。
7. 定期同步遠端分支，降低合併衝突機率。

## 16. 快速查表

| 目的 | 指令 |
| --- | --- |
| 查看狀態 | `git status` |
| 查看差異 | `git diff` |
| 加入暫存區 | `git add <檔案>` |
| 建立提交 | `git commit -m "訊息"` |
| 查看提交紀錄 | `git log --oneline` |
| 建立分支 | `git switch -c <分支>` |
| 切換分支 | `git switch <分支>` |
| 取得遠端變更 | `git fetch` |
| 拉取並合併 | `git pull` |
| 推送變更 | `git push` |
| 合併分支 | `git merge <分支>` |
| 撤銷提交 | `git revert <commit>` |
| 暫存工作 | `git stash` |

---

建議先熟悉以下最小流程：

```bash
git status
git add .
git commit -m "完成一項變更"
git push
```
