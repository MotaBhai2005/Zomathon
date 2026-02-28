import pandas as pd
import numpy as np
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

CSV_PATH = 'items.csv'
NPY_PATH = 'item_embeddings.npy'

def load_data():
    # Load your uploaded dataset
    df = pd.read_csv(CSV_PATH)
    
    # Generate embeddings if not already present
    if not os.path.exists(NPY_PATH):
        print("Generating 64D embeddings from descriptions...")
        tfidf = TfidfVectorizer(max_features=64, stop_words='english')
        matrix = tfidf.fit_transform(df['description'].fillna('')).toarray()
        np.save(NPY_PATH, matrix)
        return df, matrix
    
    return df, np.load(NPY_PATH)

df, embeddings = load_data()

def get_meal_completion_recs(item_id, top_n=5):
    idx = df[df['item_id'] == item_id].index[0]
    target_vec = embeddings[idx].reshape(1, -1)
    target_cat = df.iloc[idx]['category']

    # Vector similarity calculation
    sim_scores = cosine_similarity(target_vec, embeddings).flatten()
    
    boosted_df = df.copy()
    boosted_df['similarity'] = sim_scores
    
    # Logic to boost complementary items (e.g., drinks for mains)
    rules = {'Main': ['Side', 'Drink'], 'Starter': ['Main', 'Drink']}
    target_boosts = rules.get(target_cat, [])
    boosted_df.loc[boosted_df['category'].isin(target_boosts), 'similarity'] *= 1.5

    return boosted_df[boosted_df['item_id'] != item_id].nlargest(top_n, 'similarity').to_dict('records')