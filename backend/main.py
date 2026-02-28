from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn

app = FastAPI()

# Enable CORS for your React Frontend (Port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your 64,800 items and 64D embeddings
df = pd.read_csv('items.csv') 
embeddings = np.load('item_embeddings.npy')

@app.get("/restaurant/{res_id}/menu")
async def get_menu(res_id: int):
    menu = df[df['restaurant_id'] == res_id]
    if menu.empty:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return menu.to_dict('records')

@app.get("/category/{category_name}")
async def get_global_category(category_name: str):
    search_term = category_name.lower()
    
    # Logic to handle pluralization for common items
    if search_term == "drinks": search_term = "drink"
    if search_term == "cakes": search_term = "cake"
    if search_term == "burgers": search_term = "burger"

    # BROAD SEARCH: Checks name, category, and cuisine_type to prevent 404s
    results = df[
        df['category'].str.contains(search_term, case=False, na=False) |
        df['name'].str.contains(search_term, case=False, na=False) |
        df['cuisine_type'].str.contains(search_term, case=False, na=False)
    ]
    
    # Always return a list (even if empty) to prevent frontend .map() crashes
    return results.head(40).to_dict('records')

@app.get("/recommend/{item_id}")
async def get_recommendations(item_id: int):
    try:
        # 64D Vector Similarity for "Complete Your Meal"
        idx = df[df['item_id'] == item_id].index[0]
        target_vec = embeddings[idx].reshape(1, -1)
        scores = cosine_similarity(target_vec, embeddings).flatten()
        
        df_copy = df.copy()
        df_copy['score'] = scores
        recs = df_copy[df_copy['item_id'] != item_id].nlargest(5, 'score')
        
        return recs[['item_id', 'name', 'price', 'category', 'is_veg', 'restaurant_name']].to_dict('records')
    except Exception:
        return []

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)