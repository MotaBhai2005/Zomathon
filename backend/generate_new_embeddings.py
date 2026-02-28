import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import LabelEncoder
import time

print("1. Loading the NEW Items Catalog...")
items_df = pd.read_csv("items.csv")

print("2. Encoding Item IDs to match future PyTorch indices...")
item_encoder = LabelEncoder()
items_df['item_idx'] = item_encoder.fit_transform(items_df['item_id'])
items_df = items_df.sort_values('item_idx').reset_index(drop=True)

descriptions = items_df['description'].tolist()

print("3. Loading all-MiniLM-L6-v2...")
model = SentenceTransformer('all-MiniLM-L6-v2')

print(f"4. Generating embeddings for {len(descriptions)} items. Standby...")
start_time = time.time()
embeddings = model.encode(descriptions, show_progress_bar=True)

output_file = "new_item_embeddings.npy"
np.save(output_file, embeddings)
print(f"\nSUCCESS. Extraction complete in {round(time.time() - start_time, 2)} seconds.")
print(f"Saved strictly as: {output_file}")