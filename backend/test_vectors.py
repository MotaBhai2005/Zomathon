import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

print("Loading New Data...")
df = pd.read_csv("items.csv")

# NOTE: If you already renamed the file for the backend, change this to "item_embeddings.npy"
embeddings = np.load("final_backend_embeddings.npy") 

def test_recommendation(test_item_id):
    try:
        idx = df[df['item_id'] == test_item_id].index[0]
        target_name = df.iloc[idx]['name']
        target_cat = df.iloc[idx]['category']
        print(f"\n--- Testing ID: {test_item_id} | {target_name} ({target_cat}) ---")
        
        target_vec = embeddings[idx].reshape(1, -1)
        scores = cosine_similarity(target_vec, embeddings).flatten()
        
        # Attach scores and get top 5 (excluding the item itself)
        df_copy = df.copy()
        df_copy['score'] = scores
        top_5 = df_copy[df_copy['item_id'] != test_item_id].nlargest(5, 'score')
        
        print(top_5[['item_id', 'name', 'category', 'score']].to_string(index=False))
        
    except IndexError:
        print(f"Item ID {test_item_id} not found in items.csv.")

# --- THE STRESS TEST ---
# Testing exact IDs from your new catalog
test_recommendation(1)      # Test a Fast Food Main (Chicken Zinger Burger)
test_recommendation(3)      # Test an Indian Main (Butter Chicken)
test_recommendation(18074)  # Test a Dessert (Brownie with Ice Cream)
test_recommendation(18075)  # Test a Bread (Garlic Naan)