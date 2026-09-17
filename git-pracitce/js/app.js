const STORAGE_KEY = "git-lab-todos";

let todos = load();

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const statusBar = document.getElementById("status-bar");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, completed: false });
  input.value = "";
  save();
  render();
});

function render() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.text;
    // Lab 2a: 點擊切換完成狀態在此實作（feature/toggle-complete）
    // Lab 2b: 刪除按鈕在此實作（feature/delete-todo）
    list.appendChild(li);
  });

  // Lab 3: 狀態列文字同時被 filter / counter 分支修改，用來製造合併衝突
  statusBar.textContent = `共 ${todos.length} 筆待辦`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

render();
