from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
import re

app = FastAPI()

# Enable CORS for your React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load Data and Normalize Columns
# We normalize columns to lowercase to avoid KeyErrors (e.g., Locality vs locality)
try:
    df = pd.read_csv('items.csv') 
    df.columns = [c.strip().lower() for c in df.columns]
    
    # Load your finalized embeddings
    embeddings = np.load('item_embeddings.npy')
except Exception as e:
    print(f"Error loading data files: {e}")

@app.get("/restaurant/{res_id}/menu")
async def get_menu(res_id: int):
    menu = df[df['restaurant_id'] == res_id]
    if menu.empty:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return menu.to_dict('records')

# --- DYNAMIC CATEGORY DISCOVERY ---
@app.get("/categories/available")
async def get_available_categories():
    # Extracts unique categories/cuisines directly from your CSV
    cats = df['category'].dropna().unique().tolist()
    cuisines = df['cuisine_type'].dropna().unique().tolist()
    all_cats = list(set([str(c).strip() for c in cats + cuisines]))
    return sorted([c for c in all_cats if c.lower() != 'nan'])

# --- REFINED CATEGORY SEARCH (Dosa & Street Food Fixes) ---
@app.get("/category/{category_name}")
async def get_global_category(category_name: str):
    search_term = category_name.lower().strip()
    
    # Comprehensive synonym map to bridge UI labels and CSV data
    synonyms = {
        "dosa": "dosa|idli|vada|uttapam|south indian|sambhar",
        "drinks": "drink|beverage|cola|sprite|pepsi|shake|lassi|tea|soda|juice|coffee",
        "cakes": "cake|pastry|brownie|cupcake|muffin",
        "burgers": "burger|sliders|zinger",
        "biryani": "biryani|pulao|rice",
        "pizza": "pizza|calzone|garlic bread",
        "thali": "thali|platter|meal",
        "dessert": "dessert|ice cream|halwa|jamun|rasmalai|sweet",
        "mughlai": "mughlai|kebab|tandoori|butter chicken|naan|curry",
        "street food": "street|chaat|gupchup|rolls|dahibara|momo|pav bhaji|vada pav",
        "paneer": "paneer|cottage cheese",
        "chicken": "chicken|poultry|wings",
        "chinese": "chinese|manchurian|noodles|hakka|chowmein"
    }
    
    search_pattern = synonyms.get(search_term, search_term)

    # Multi-column regex search across Name, Category, and Cuisine
    mask = (
        df['name'].str.contains(search_pattern, case=False, na=False, regex=True) |
        df['category'].str.contains(search_pattern, case=False, na=False, regex=True) |
        df['cuisine_type'].str.contains(search_pattern, case=False, na=False, regex=True)
    )
    
    results = df[mask].drop_duplicates(subset=['item_id'])
    return results.head(50).to_dict('records')

# --- DYNAMIC LOCATION EXTRACTOR (Using 'locality' from CSV) ---
@app.get("/locations/available")
async def get_available_locations():
    # In your CSV, locality is "City, Area" (e.g. Bhubaneswar, Airport Road)
    if 'locality' in df.columns:
        unique_localities = df['locality'].dropna().unique()
        areas = []
        for loc in unique_localities:
            parts = loc.split(',')
            # Neighborhood is usually the part after the city name
            area = parts[1].strip() if len(parts) > 1 else parts[0].strip()
            areas.append(area)
        return sorted(list(set(areas)))
    return ["Bhubaneswar"]

# --- LOCATION FILTERED RESTAURANTS ---
@app.get("/restaurants/location/{area}")
async def get_restaurants_by_location(area: str):
    area_query = area.lower().strip()
    mask = df['locality'].str.contains(area_query, case=False, na=False)
    
    nearby = df[mask][['restaurant_id', 'restaurant_name', 'locality', 'cuisine_type']].drop_duplicates()
    
    if nearby.empty:
        # Fallback to show popular restaurants if no area matches
        return df[['restaurant_id', 'restaurant_name', 'locality', 'cuisine_type']].drop_duplicates().head(10).to_dict('records')
        
    return nearby.to_dict('records')

# --- GLOBAL SEARCH (For the Search Bar) ---
@app.get("/search")
async def global_search(q: str = Query(...)):
    query = q.lower().strip()
    mask = (
        df['name'].str.contains(query, case=False, na=False) |
        df['restaurant_name'].str.contains(query, case=False, na=False) |
        df['category'].str.contains(query, case=False, na=False)
    )
    return df[mask].head(25).to_dict('records')

# --- OPTIMIZED RECOMMENDATION ENGINE ---
@app.get("/recommend/{item_id}")
async def get_recommendations(item_id: int):
    try:
        target_indices = df.index[df['item_id'] == item_id].tolist()
        if not target_indices: return []
        
        idx = target_indices[0]
        target_vec = embeddings[idx].reshape(1, -1)
        
        # Fast Cosine Similarity
        scores = cosine_similarity(target_vec, embeddings).flatten()
        
        # argpartition for O(n) top-K retrieval
        best_indices = np.argpartition(scores, -6)[-6:]
        best_indices = best_indices[best_indices != idx]
        
        recs = df.iloc[best_indices].copy()
        recs['score'] = scores[best_indices]
        
        return recs.sort_values(by='score', ascending=False)[
            ['item_id', 'name', 'price', 'category', 'is_veg', 'restaurant_name']
        ].to_dict('records')
    except Exception as e:
        print(f"Recommendation Error: {e}")
        return []

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)