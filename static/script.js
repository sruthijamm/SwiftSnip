// Fetch snippets from the API and display them
async function loadSnippets() {
    const response = await fetch('/snippets');
    const snippets = await response.json();
  
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
  
  // Show a snippet in the right panel
  function showSnippet(snippet) {
    const panel = document.getElementById('right-panel');
    panel.innerHTML = `
      <div class="snippet-view">
        <p class="snippet-category">${snippet.category}</p>
        <h2 class="snippet-title">${snippet.title}</h2>
        <pre class="snippet-content">${snippet.content}</pre>
        <button class="copy-btn" onclick="copySnippet('${snippet.id}')">Copy to Clipboard</button>
      </div>
    `;
  }
  
  // Copy snippet content to clipboard
  function copySnippet(id) {
    const content = document.querySelector('.snippet-content').textContent;
    navigator.clipboard.writeText(content);
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied! ✓';
    setTimeout(() => btn.textContent = 'Copy to Clipboard', 2000);
  }
  
  // Load snippets when page opens
  loadSnippets();

  // Show the Add Snippet form in the right panel
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

// Save the new snippet to the API
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