// app.js — Step 1: cache all our elements & then store them in a function for now so we can verify we got them in our console.

// Cache by ID
const formEl     = document.getElementById('add-form');
const inputEl    = document.getElementById('task-input');
const errorEl    = document.getElementById('task-error');
const addBtn     = document.getElementById('add-btn');
const filterBar  = document.getElementById('filter-bar');
const listEl     = document.getElementById('todo-list');
const toastEl    = document.getElementById('toast');
const printBtn   = document.getElementById('print-btn');
const counterEl  = document.getElementById('counter');
const totalEl    = document.getElementById('total');
const templateEl = document.getElementById('todo-item-template');

// Cache by querySelector / querySelectorAll
const firstFilterBtn = document.querySelector('.filter-btn');      // single element
const allFilterBtns  = document.querySelectorAll('.filter-btn');   // NodeList (collection)

// Minimal init (no side effects yet)
(function init() {
  // Sanity check only (safe to remove later)
  console.log('Cached:', {
    formEl, inputEl, errorEl, addBtn, filterBar, listEl, toastEl,
    printBtn, counterEl, totalEl, templateEl, firstFilterBtn, allFilterBtns
  });
})();

// ===== Step 2 : data, render functions , counters =====
// Step 2 sets up the tiny data model (items), 
// then defines renderAll() which clears the list, 
// clones the <template> once per task, fills in the label/checkbox, 
// applies the .done class if needed, and appends everything in one go with a DocumentFragment for efficiency; it also defines updateCounters() to write the total/done numbers into the page, 
// and finally calls both once so the UI starts in a known (empty) state—this satisfies our template/cloneNode + fragment requirement and the “modify text content” bit for the counters.

let items = []; // simple in-memory list

function renderAll(arr) {
  listEl.innerHTML = '';
  const frag = document.createDocumentFragment();

  arr.forEach((item) => {
    const li = templateEl.content.firstElementChild.cloneNode(true);
    const checkbox = li.querySelector('.toggle');
    const label = li.querySelector('.label');

    label.textContent = item.text;
    checkbox.checked = !!item.done;
    if (item.done) li.classList.add('done');

    frag.appendChild(li);
  });

  listEl.appendChild(frag);
}

function updateCounters() {
  totalEl.textContent = String(items.length);
  counterEl.textContent = String(items.filter(it => it.done).length);
}

// updates the page once at the very start — shows an empty list and zero counters — so what you see immediately matches the current data.
renderAll(items);
updateCounters();

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
    const li = document.createElement('li');   // createElement + appendChild
    li.textContent = 'No tasks yet.';
    li.className = 'empty';
    listEl.appendChild(li);
  }
};

// Live validation (DOM event-based) + modify attribute/text
const onTaskInput = () => {
  if (inputEl.checkValidity()) {
    errorEl.textContent = '';
    addBtn.removeAttribute('disabled');
  } else {
    errorEl.textContent = 'Enter at least 2 characters.';
    addBtn.setAttribute('disabled', '');
  }
};

// Add a task (uses template rendering from Step 2)
const onAddSubmit = (e) => {
  e.preventDefault();
  if (!inputEl.checkValidity()) { onTaskInput(); return; }
  const text = inputEl.value.trim();
  items.push({ text, done: false });
  inputEl.value = '';
  onTaskInput();
  refresh();
};

// Find index of an <li> by walking siblings (parent/child/sibling nav)
const liIndex = (li) => {
  let i = 0, node = listEl.firstElementChild;
  while (node) {
    if (node === li) return i;
    node = node.nextElementSibling;            // sibling navigation
    i++;
  }
  return -1;
};

// Toggle or delete via event delegation
const onListClick = (e) => {
  const t = e.target;

  if (t.classList.contains('delete')) {
    const li = t.parentNode;                   // parent-child navigation
    const idx = liIndex(li);
    if (idx >= 0 && idx < items.length) {
      items.splice(idx, 1);
      refresh();
    }
  }

  if (t.classList.contains('toggle')) {
    const li = t.parentNode.parentNode;        // checkbox -> label -> li
    const idx = liIndex(li);
    if (idx >= 0 && idx < items.length) {
      items[idx].done = t.checked;             // class applied on re-render
      refresh();
    }
  }
};

// Listeners (different event types)
inputEl.addEventListener('input', onTaskInput);
formEl.addEventListener('submit', onAddSubmit);
listEl.addEventListener('click', onListClick);

// Start
onTaskInput();   // set initial disabled/error state
refresh();       // first draw


