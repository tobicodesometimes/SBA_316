// app.js — Step 1: cache all our elements & then store them in a function for now so we can verify we got them in our console.

// Cache by ID
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("task-input");
const errorEl = document.getElementById("task-error");
const addBtn = document.getElementById("add-btn");
const filterBar = document.getElementById("filter-bar");
const listEl = document.getElementById("todo-list");
const toastEl = document.getElementById("toast");
const counterEl = document.getElementById("counter");
const totalEl = document.getElementById("total");
const templateEl = document.getElementById("todo-item-template");

// Cache by querySelectorAll
const allFilterBtns = document.querySelectorAll(".filter-btn"); // NodeList (collection)

// ===== Step 2 : data, render functions , counters =====
// Added a tiny task list: 
// keeps tasks in an array, 
// draws them by cloning a template into a fragment, 
// updates the done/total counters, 
// and runs both once so the page starts with an empty list and zero counts.

let items = []; // simple in-memory list

function renderAll(arr) {
  listEl.innerHTML = "";
  const frag = document.createDocumentFragment();

  arr.forEach((item) => {
    const li = templateEl.content.firstElementChild.cloneNode(true);
    const checkbox = li.querySelector(".toggle");
    const label = li.querySelector(".label");

    label.textContent = item.text;
    checkbox.checked = !!item.done;
    if (item.done) li.classList.add("done");

    frag.appendChild(li);
  });

  listEl.appendChild(frag);
}

function updateCounters() {
  totalEl.textContent = String(items.length);
  counterEl.textContent = String(items.filter((it) => it.done).length);
}

// ===== Step 3 : add / toggle / delete + simple validation + empty state =====
// Step 3 makes the app actually work: it checks our input, adds a task on submit,
// lets you check or delete tasks with one click handler,
// then redraws the list and counters (showing “No tasks yet.” if empty).

const refresh = () => {
  renderAll(items);
  updateCounters();
  showEmptyMessage();
};

const showEmptyMessage = () => {
  if (items.length === 0) {
    const li = document.createElement("li"); // createElement + appendChild
    li.textContent = "No tasks yet.";
    li.className = "empty";
    listEl.appendChild(li);
  }
};

// Live validation (DOM event-based) + modify attribute/text
const onTaskInput = () => {
  if (inputEl.checkValidity()) {
    errorEl.textContent = "";
    addBtn.removeAttribute("disabled");
  } else {
    errorEl.textContent = "Enter at least 2 characters.";
    addBtn.setAttribute("disabled", "");
  }
};

// Add a task (uses template rendering from Step 2)
const onAddSubmit = (e) => {
  e.preventDefault();
  if (!inputEl.checkValidity()) {
    onTaskInput();
    return;
  }
  const text = inputEl.value.trim();
  items.push({ text, done: false });
  inputEl.value = "";
  onTaskInput();
  refresh();
};

// Find index of an <li> by checking for siblings (parent/child/sibling navigation)
const liIndex = (li) => {
  let i = 0,
    node = listEl.firstElementChild;
  while (node) {
    if (node === li) return i;
    node = node.nextElementSibling; // sibling navigation
    i++;
  }
  return -1;
};

// Toggle or delete via event delegation
const onListClick = (e) => {
  const t = e.target;

  if (t.classList.contains("delete")) {
    const li = t.parentNode; // parent-child navigation
    const idx = liIndex(li);
    if (idx >= 0 && idx < items.length) {
      items.splice(idx, 1);
      refresh();
    }
  }

  if (t.classList.contains("toggle")) {
    const li = t.parentNode.parentNode; // checkbox -> label -> li
    const idx = liIndex(li);
    if (idx >= 0 && idx < items.length) {
      items[idx].done = t.checked; // class applied on re-render
      refresh();
    }
  }
};

// Listeners (different event types)
inputEl.addEventListener("input", onTaskInput);
formEl.addEventListener("submit", onAddSubmit);
listEl.addEventListener("click", onListClick);

// Start
onTaskInput(); // set initial disabled/error state
refresh(); // first draw

// ===== Step 4 : filters + toast + storage (BOM) =====
let currentFilter = "all";
const STORAGE_KEY = "todo.items";

// -- storage
const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};
const load = () => {
  try {
    items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    items = [];
  }
};

// -- tiny toast (uses BOM: setTimeout)
const showToast = (msg) => {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  setTimeout(() => {
    toastEl.hidden = true;
  }, 1000);
};

// -- filters (iterate over DOM elements + modify style)
const applyFilter = (filter) => {
  currentFilter = filter;
  const kids = listEl.children;
  for (let i = 0; i < kids.length; i++) {
    const li = kids[i];
    const done = li.classList.contains("done");
    const show =
      filter === "all" ||
      (filter === "active" && !done) ||
      (filter === "done" && done);
    li.style.display = show ? "" : "none";
  }
};

filterBar.addEventListener("click", (e) => {
  const btn = e.target;
  if (btn.tagName !== "BUTTON") return;
  const filter = btn.getAttribute("data-filter");
  for (let i = 0; i < allFilterBtns.length; i++) {
    allFilterBtns[i].setAttribute(
      "aria-pressed",
      allFilterBtns[i] === btn ? "true" : "false"
    ); // modify attribute
  }
  applyFilter(filter);
});

// save + toast pop-up on actions from Step 3
formEl.addEventListener("submit", () => {
  save();
  showToast("Added");
});
listEl.addEventListener("click", () => {
  save();
  showToast("Saved");
});

// load then draw
load();
refresh();
