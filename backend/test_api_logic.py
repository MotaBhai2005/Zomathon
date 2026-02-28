import pandas as pd
from model_utils import get_meal_completion_recs

print("Loading dataset for Dynamic Stress Test...")
df = pd.read_csv('items.csv')

def test_by_keyword(keyword):
    # Find the first item that contains the keyword
    matches = df[df['name'].str.contains(keyword, case=False, na=False)]
    if matches.empty:
        print(f"\n[!] ERROR: Could not find any item matching '{keyword}' in your CSV.")
        return
    
    target = matches.iloc[0]
    item_id = int(target['item_id']) # Force integer to fix the Pandas float bug
    name = target['name']
    
    print(f"\n--- Testing: {name} (ID: {item_id}) ---")
    
    # We pass the explicitly casted integer to prevent deduplication failure
    results = get_meal_completion_recs(item_id)
    
    if not results:
        print("No recommendations returned.")
        return
        
    for r in results:
        print(f"{r['name']:<25} | {r['category']:<10} | {r['cuisine_type']:<15} | Score: {r['similarity']:.3f}")

# The Gauntlet
test_by_keyword("Pizza")      # Should recommend Sides/Drinks, NO Indian food
test_by_keyword("Momos")      # Chinese Starter -> Should recommend Chinese Mains (Noodles)
test_by_keyword("Dosa")       # South Indian Main -> Should recommend Idli, Vada, or Drinks
test_by_keyword("Coke")       # Beverage -> Should only recommend other Drinks or Desserts