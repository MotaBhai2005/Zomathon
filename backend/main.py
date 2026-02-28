from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn

app = FastAPI()

# Enable CORS for your React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your finalized items and embeddings
# Ensure you use the latest corrected CSV file
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
    # Clean the input
    search_term = category_name.lower().strip()
    
    # Handle common pluralization and synonyms
    synonyms = {
        "drinks": "drink",
        "cakes": "cake",
        "burgers": "burger",
        "thalis": "thali",
        "biryanis": "biryani"
    }
    search_term = synonyms.get(search_term, search_term)

    # PRIORITY SEARCH LOGIC:
    # 1. Search by Name (Fixes the Biryani/Pizza 'Main' category issue)
    name_matches = df[df['name'].str.contains(search_term, case=False, na=False)]
    
    # 2. Search by Category
    category_matches = df[df['category'].str.contains(search_term, case=False, na=False)]
    
    # 3. Search by Cuisine Type
    cuisine_matches = df[df['cuisine_type'].str.contains(search_term, case=False, na=False)]

    # Combine and prioritize name matches, then remove duplicates
    combined = pd.concat([name_matches, category_matches, cuisine_matches])
    results = combined.drop_duplicates(subset=['item_id'])
    
    return results.head(50).to_dict('records')

@app.get("/recommend/{item_id}")
async def get_recommendations(item_id: int):
    try:
        # Optimization: Find index without copying the entire DataFrame
        target_indices = df.index[df['item_id'] == item_id].tolist()
        if not target_indices:
            return []
            
        idx = target_indices[0]
        target_vec = embeddings[idx].reshape(1, -1)
        
        # Calculate similarity scores
        scores = cosine_similarity(target_vec, embeddings).flatten()
        
        # Fast retrieval using argpartition (O(n) complexity vs O(n log n))
        # Get top 6 (one will be the target item itself)
        best_indices = np.argpartition(scores, -6)[-6:]
        
        # Filter out the target item from recommendations
        best_indices = best_indices[best_indices != idx]
        
        # Retrieve final rows and sort by score
        recs = df.iloc[best_indices].copy()
        recs['score'] = scores[best_indices]
        
        # Return specific fields needed for the CSAO Rail
        return recs.sort_values(by='score', ascending=False)[
            ['item_id', 'name', 'price', 'category', 'is_veg', 'restaurant_name']
        ].to_dict('records')
        
    except Exception as e:
        print(f"Recommendation Error: {e}")
        return []

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)