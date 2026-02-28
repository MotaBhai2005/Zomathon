from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 1. Import the dataframe and your advanced recommendation logic from your local setup
from model_utils import df, get_meal_completion_recs

# CRITICAL FIX: Your repo main.py sanitized columns to avoid KeyErrors, 
# but your model_utils.py didn't. We must sanitize the imported df here 
# before the API endpoints try to access 'category' or 'locality'.
df.columns = [str(c).strip().lower() for c in df.columns]

app = FastAPI()

# Enable CORS for your React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/restaurant/{res_id}/menu")
async def get_menu(res_id: int):
    menu = df[df['restaurant_id'] == res_id]
    if menu.empty:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return menu.to_dict('records')

# --- DYNAMIC CATEGORY DISCOVERY ---
@app.get("/categories/available")
async def get_available_categories():
    if 'category' in df.columns and 'cuisine_type' in df.columns:
        cats = df['category'].dropna().unique().tolist()
        cuisines = df['cuisine_type'].dropna().unique().tolist()
        all_cats = list(set([str(c).strip() for c in cats + cuisines]))
        return sorted([c for c in all_cats if c.lower() != 'nan'])
    return []

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

    mask = (
        df['name'].str.contains(search_pattern, case=False, na=False, regex=True) |
        df['category'].str.contains(search_pattern, case=False, na=False, regex=True) |
        df['cuisine_type'].str.contains(search_pattern, case=False, na=False, regex=True)
    )
    
    results = df[mask].drop_duplicates(subset=['item_id'])
    return results.head(50).to_dict('records')

# --- DYNAMIC LOCATION EXTRACTOR ---
@app.get("/locations/available")
async def get_available_locations():
    if 'locality' in df.columns:
        unique_localities = df['locality'].dropna().unique()
        areas = []
        for loc in unique_localities:
            parts = str(loc).split(',')
            area = parts[1].strip() if len(parts) > 1 else parts[0].strip()
            areas.append(area)
        return sorted(list(set(areas)))
    return ["Bhubaneswar"]

# --- LOCATION FILTERED RESTAURANTS ---
@app.get("/restaurants/location/{area}")
async def get_restaurants_by_location(area: str):
    area_query = area.lower().strip()
    if 'locality' in df.columns:
        mask = df['locality'].str.contains(area_query, case=False, na=False)
        nearby = df[mask][['restaurant_id', 'restaurant_name', 'locality', 'cuisine_type']].drop_duplicates()
        
        if nearby.empty:
            return df[['restaurant_id', 'restaurant_name', 'locality', 'cuisine_type']].drop_duplicates().head(10).to_dict('records')
        return nearby.to_dict('records')
    return []

# --- GLOBAL SEARCH ---
@app.get("/search")
async def global_search(q: str = Query(...)):
    query = q.lower().strip()
    mask = (
        df['name'].str.contains(query, case=False, na=False) |
        df['restaurant_name'].str.contains(query, case=False, na=False) |
        df['category'].str.contains(query, case=False, na=False)
    )
    return df[mask].head(25).to_dict('records')

# --- ADVANCED RECOMMENDATION ENGINE (Wired to model_utils.py) ---
@app.get("/recommend/{item_id}")
async def get_recommendations(item_id: int):
    try:
        # Uses your custom boosting logic instead of the dumb fast-cosine approach
        recs = get_meal_completion_recs(item_id, top_n=6)
        
        cleaned_recs = []
        for r in recs:
            cleaned_recs.append({
                "item_id": r.get("item_id"),
                "name": r.get("name"),
                "price": r.get("price"),
                "category": r.get("category"),
                "is_veg": r.get("is_veg"),
                "restaurant_name": r.get("restaurant_name")
            })
        return cleaned_recs
    except IndexError:
        raise HTTPException(status_code=404, detail="Item ID not found in dataset")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)