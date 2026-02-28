import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

CSV_PATH = 'items.csv' 
NPY_PATH = 'item_embeddings.npy'

df = pd.read_csv(CSV_PATH)
embeddings = np.load(NPY_PATH)

def get_meal_completion_recs(item_id, top_n=5):
    try:
        idx = df[df['item_id'] == int(item_id)].index[0]
    except IndexError:
        return []

    target_vec = embeddings[idx].reshape(1, -1)
    target_cat = df.iloc[idx]['category']
    target_cuisine = df.iloc[idx]['cuisine_type']
    target_name = str(df.iloc[idx]['name']).lower()

    sim_scores = cosine_similarity(target_vec, embeddings).flatten()
    boosted_df = df.copy()
    boosted_df['similarity'] = sim_scores
    
    # Cuisine Shield
    cross_cuisine_mask = (boosted_df['cuisine_type'] != target_cuisine) & (~boosted_df['category'].isin(['Drink', 'Beverage', 'Dessert']))
    boosted_df.loc[cross_cuisine_mask, 'similarity'] *= 0.1
    
    # Dessert Kill-Switch
    if target_cat in ['Main', 'Bread']:
        boosted_df.loc[boosted_df['category'] == 'Dessert', 'similarity'] *= 0.05

    fast_food_keywords = ['burger', 'pizza', 'sandwich', 'wrap', 'fries', 'pasta']
    is_fast_food = any(w in target_name for w in fast_food_keywords)
    
    wet_keywords = ['chicken', 'paneer', 'masala', 'gravy', 'curry', 'makhani', 'dal', 'chole']
    is_wet_target = any(w in target_name for w in wet_keywords) and target_cat == 'Main' and not is_fast_food

    if target_cat == 'Main':
        boosted_df.loc[boosted_df['category'] == 'Main', 'similarity'] *= 0.1 # Nuke other mains harder
        
        if is_wet_target:
            boosted_df.loc[boosted_df['category'] == 'Bread', 'similarity'] *= 4.0
        else:
            boosted_df.loc[boosted_df['category'] == 'Side', 'similarity'] *= 4.0
            boosted_df.loc[boosted_df['category'].isin(['Drink', 'Beverage']), 'similarity'] *= 3.0
            boosted_df.loc[boosted_df['category'] == 'Starter', 'similarity'] *= 2.0 # Fallback for Fast Food

    elif target_cat == 'Starter':
        boosted_df.loc[boosted_df['category'] == 'Main', 'similarity'] *= 3.0
        boosted_df.loc[boosted_df['category'] == 'Starter', 'similarity'] *= 0.1 # Don't suggest 5 starters

    elif target_cat == 'Bread':
        boosted_df.loc[boosted_df['category'] == 'Main', 'similarity'] *= 3.0
        boosted_df.loc[boosted_df['is_veg'] == 0, 'similarity'] *= 1.3
        dry_mask = boosted_df['name'].str.lower().str.contains('biryani|thali|burger|pizza')
        boosted_df.loc[dry_mask, 'similarity'] *= 0.1

    elif target_cat == 'Dessert':
        boosted_df.loc[~boosted_df['category'].isin(['Dessert', 'Drink', 'Beverage']), 'similarity'] *= 0.01

    if is_fast_food:
        boosted_df.loc[boosted_df['category'] == 'Bread', 'similarity'] *= 0.01
        boosted_df.loc[boosted_df['category'] == 'Side', 'similarity'] *= 20.0
        boosted_df.loc[boosted_df['category'] == 'Starter', 'similarity'] *= 15.0 # E.g., Wings for Pizza
        boosted_df.loc[boosted_df['category'].isin(['Drink', 'Beverage']), 'similarity'] *= 15.0

    boosted_df = boosted_df.sort_values(by='similarity', ascending=False)
    
    final_recs = []
    
    # THE FIX: Pre-seed the blacklist with the anchor item's name
    seen_names = {target_name.split('(')[0].strip()}
    
    for _, row in boosted_df.iterrows():
        clean_name = str(row['name']).split('(')[0].strip().lower()
        
        if int(float(row['item_id'])) == int(float(item_id)) or clean_name in seen_names:
            continue
            
        final_recs.append(row.to_dict())
        seen_names.add(clean_name)
        
        if len(final_recs) == top_n:
            break
            
    return final_recs