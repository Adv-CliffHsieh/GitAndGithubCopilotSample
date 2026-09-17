const listEl = document.querySelector('#todo-list');
const formEl = document.querySelector('#todo-form');
const inputEl = document.querySelector('#todo-input');
const emptyHintEl = document.querySelector('#empty-hint');

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const { data } = await res.json();
  return data;
}

function render(todos) {
  listEl.innerHTML = '';
  emptyHintEl.hidden = todos.length > 0;

  for (const todo of todos) {
    const li = document.createElement('li');
    li.className = todo.done ? 'todo done' : 'todo';
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = todo.title;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'delete';
    delBtn.textContent = '刪除';
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.append(checkbox, span, delBtn);
    listEl.append(li);
  }
}

async function refresh() {
  render(await fetchTodos());
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  inputEl.value = '';
  await refresh();
});

async function toggleTodo(id, done) {
  await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done }),
  });
  await refresh();
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
}

refresh();
