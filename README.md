Simple To-Do — README

A tiny single-page to-do list built to practice the DOM (HTML/CSS/JS).
 
How to run: open index.html in your browser.

Files

index.html – basic page, form, filter buttons, list, toast, and a template for items

style.css – very simple styles 

app.js – all logic (Steps 1–4 below)

Step 1 — Select what we’ll work with (DOM caching)

What I did

Grabbed key elements by ID (getElementById) and by query (querySelectorAll('.filter-btn')).

Kept references (variables) so we can read/update the page easily later.

Why it matters

Faster, cleaner code: we find elements once and reuse them.

Step 2 — Data + Render + Counters

What I did

Made a simple array items to hold tasks.

Wrote renderAll() to clone the <template> for each task and add them via a DocumentFragment (appends the batch).

Wrote updateCounters() to show done/total using textContent.

Called both once so the page starts in a known state.

Why it matters

Separates data (array) from the view (list on the page) and updates text cleanly.

Step 3 — Basic Interactions (Add / Toggle / Delete) + Validation

What I did

Live validation: on input, we check checkValidity(); enable/disable the Add button and show a tiny error message.

Add task: on form submit, we push a new item, clear the box, and refresh the UI.

Toggle/Delete: one click listener on the list (event delegation); we walk parent/child/sibling nodes to find the right <li>, toggle its checkbox (done) or remove it.

If the list is empty, we createElement('li') to show “No tasks yet.”

Why it matters

Delivers the core to-do behavior with very basic, readable code.

Step 4 — Filters + Toast + Storage (BOM)

What I did

Filters (All / Active / Done): loop the list items and switch style.display to show/hide.

Set aria-pressed on the active filter (attribute change for clarity).

Toast: quick “Saved/Added” message that hides via setTimeout.

Save/Load: store the task array with localStorage so it persists across reloads.

Why it matters

Meets the “use two BOM features” requirement and adds small but useful UX.

Using it

Type a task and press Add.

Click the checkbox to mark done; click Delete to remove.

Use All / Active / Done to filter.

Reload the page — your tasks remain (saved in your browser via localStorage).
