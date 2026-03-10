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