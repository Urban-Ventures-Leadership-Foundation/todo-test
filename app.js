const STORAGE_KEY = "todos";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const countLabel = document.getElementById("todo-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = loadTodos();
let filter = "all";

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, completed: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

function getVisibleTodos() {
  if (filter === "active") return todos.filter((t) => !t.completed);
  if (filter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

function render() {
  const visible = getVisibleTodos();
  list.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = todos.length === 0 ? "No tasks yet. Add one above!" : "Nothing here.";
    list.appendChild(empty);
  }

  for (const todo of visible) {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "×";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteBtn);
    list.appendChild(item);
  }

  const activeCount = todos.filter((t) => !t.completed).length;
  countLabel.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

render();
