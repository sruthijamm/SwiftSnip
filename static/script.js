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