from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os 

app = FastAPI()

app.mount('/static', StaticFiles(directory='static'), name='static')

DATA_FILE = 'snippets.json'

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@app.get('/')
def read_root():
    return {'message': 'Snippet Manager is alive!'}

@app.get("/snippets")
def get_snippets():
    with open(DATA_FILE, "r") as f:
        snippets = json.load(f)
    return snippets

# Data model for a new snippet
class Snippet(BaseModel):
    title: str
    content: str
    category: str

# Save a new snippet
@app.post("/snippets")
def create_snippet(snippet: Snippet):
    with open(DATA_FILE, "r") as f:
        snippets = json.load(f)
    
    new_snippet = {
        "id": len(snippets) + 1,
        "title": snippet.title,
        "content": snippet.content,
        "category": snippet.category,
        "created_at": "2026-03-10"
    }
    
    snippets.append(new_snippet)
    
    with open(DATA_FILE, "w") as f:
        json.dump(snippets, f, indent=2)
    
    return new_snippet

# Update an existing snippet
@app.put("/snippets/{snippet_id}")
def update_snippet(snippet_id: int, snippet: Snippet):
    with open(DATA_FILE, "r") as f:
        snippets = json.load(f)
    
    for i, s in enumerate(snippets):
        if s["id"] == snippet_id:
            snippets[i]["title"] = snippet.title
            snippets[i]["content"] = snippet.content
            snippets[i]["category"] = snippet.category
            break
    
    with open(DATA_FILE, "w") as f:
        json.dump(snippets, f, indent=2)
    
    return snippets[i]

# Delete a snippet
@app.delete("/snippets/{snippet_id}")
def delete_snippet(snippet_id: int):
    with open(DATA_FILE, "r") as f:
        snippets = json.load(f)
    
    snippets = [s for s in snippets if s["id"] != snippet_id]
    
    with open(DATA_FILE, "w") as f:
        json.dump(snippets, f, indent=2)
    
    return {"message": "Snippet deleted!"}