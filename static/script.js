let allSnippets = [];

// Fetch snippets from the API and display them
async function loadSnippets() {
  const response = await fetch('/snippets');
  allSnippets = await response.json();
  renderSnippets(allSnippets);
}

// Render a given list of snippets
function renderSnippets(snippets) {
  const list = document.getElementById('snippet-list');
  list.innerHTML = '';

  snippets.forEach(snippet => {
    const li = document.createElement('li');
    li.classList.add('snippet-item');
    li.textContent = snippet.title;
    li.onclick = () => showSnippet(snippet);
    list.appendChild(li);
  });
}

// Search snippets in real time
function searchSnippets(query) {
  const filtered = allSnippets.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.content.toLowerCase().includes(query.toLowerCase())
  );
  renderSnippets(filtered);
}

// Filter by category
function filterByCategory(category, element) {
  // Update active state
  document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
  element.classList.add('active');

  if (category === 'All') {
    renderSnippets(allSnippets);
  } else {
    const filtered = allSnippets.filter(s => s.category === category);
    renderSnippets(filtered);
  }
}

// Show a snippet in the right panel
function showSnippet(snippet) {
  const panel = document.getElementById('right-panel');
  panel.innerHTML = `
    <div class="snippet-view">
      <p class="snippet-category">${snippet.category}</p>
      <h2 class="snippet-title">${snippet.title}</h2>
      <pre class="snippet-content">${snippet.content}</pre>
      <div class="action-btns">
        <button class="copy-btn" onclick="copySnippet()">Copy to Clipboard</button>
        <button class="edit-btn" onclick="showEditForm(${snippet.id}, '${snippet.title}', '${snippet.category}', \`${snippet.content}\`)">Edit</button>
        <button class="delete-btn" onclick="deleteSnippet(${snippet.id})">Delete</button>
      </div>
    </div>
  `;
}

// Copy snippet content to clipboard
function copySnippet() {
  const content = document.querySelector('.snippet-content').textContent;
  navigator.clipboard.writeText(content);
  const btn = document.querySelector('.copy-btn');
  btn.textContent = 'Copied! ✓';
  setTimeout(() => btn.textContent = 'Copy to Clipboard', 2000);
}

// Show add form
function showAddForm() {
  const panel = document.getElementById('right-panel');
  panel.innerHTML = `
    <div class="snippet-form">
      <h2 class="form-title">New Snippet</h2>
      <input type="text" id="form-title" placeholder="Title" class="form-input" />
      <input type="text" id="form-category" placeholder="Category" class="form-input" />
      <textarea id="form-content" placeholder="Your snippet content..." class="form-textarea"></textarea>
      <button class="save-btn" onclick="saveSnippet()">Save Snippet</button>
    </div>
  `;
}

// Save new snippet
async function saveSnippet() {
  const title = document.getElementById('form-title').value;
  const category = document.getElementById('form-category').value;
  const content = document.getElementById('form-content').value;

  await fetch('/snippets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, content })
  });

  loadSnippets();
}

// Show edit form
function showEditForm(id, title, category, content) {
  const panel = document.getElementById('right-panel');
  panel.innerHTML = `
    <div class="snippet-form">
      <h2 class="form-title">Edit Snippet</h2>
      <input type="text" id="form-title" value="${title}" class="form-input" />
      <input type="text" id="form-category" value="${category}" class="form-input" />
      <textarea id="form-content" class="form-textarea">${content}</textarea>
      <button class="save-btn" onclick="updateSnippet(${id})">Save Changes</button>
    </div>
  `;
}

// Update snippet
async function updateSnippet(id) {
  const title = document.getElementById('form-title').value;
  const category = document.getElementById('form-category').value;
  const content = document.getElementById('form-content').value;

  await fetch(`/snippets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, content })
  });

  loadSnippets();
}

// Delete snippet
async function deleteSnippet(id) {
  await fetch(`/snippets/${id}`, { method: 'DELETE' });

  document.getElementById('right-panel').innerHTML = `
    <div class="empty-state">
      <p>Select a snippet to view it here ✨</p>
    </div>
  `;

  loadSnippets();
}

// Load snippets when page opens
loadSnippets();