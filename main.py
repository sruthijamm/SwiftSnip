from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
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