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
