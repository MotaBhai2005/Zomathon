import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from sklearn.preprocessing import LabelEncoder
import time

# --- 1. UPDATED DATASET CLASS ---
class FoodInteractionDataset(Dataset):
    def __init__(self, interactions_path, items_path, num_negatives=4):
        print("Loading datasets...")
        self.interactions = pd.read_csv(interactions_path)
        self.items = pd.read_csv(items_path)
        self.num_negatives = num_negatives

        self.interactions['timestamp'] = pd.to_datetime(self.interactions['timestamp'])
        self.interactions = self.interactions.sort_values('timestamp')

        self.user_encoder = LabelEncoder()
        self.item_encoder = LabelEncoder()
        
        self.interactions['user_idx'] = self.user_encoder.fit_transform(self.interactions['user_id'])
        self.item_encoder.fit(self.items['item_id'])
        self.interactions['item_idx'] = self.item_encoder.transform(self.interactions['item_id'])

        # FIXED: Mapped to the new 'interaction_type' column
        event_weights = {
            'view': 1.0,
            'click': 1.0,               # Added based on your new data
            'click_recommendation': 1.0,
            'add_to_cart': 3.0,
            'order': 5.0
        }
        self.interactions['weight'] = self.interactions['interaction_type'].map(event_weights).fillna(1.0)

        print("Precomputing user histories...")
        self.user_histories = self.interactions.groupby('user_idx')['item_idx'].apply(set).to_dict()
        self.total_items = len(self.item_encoder.classes_)
        
        self.user_indices = self.interactions['user_idx'].values
        self.pos_item_indices = self.interactions['item_idx'].values
        self.weights = self.interactions['weight'].values

    def __len__(self): return len(self.interactions)

    def __getitem__(self, idx):
        user_idx = self.user_indices[idx]
        pos_item_idx = self.pos_item_indices[idx]
        weight = self.weights[idx]

        neg_items = []
        user_history = self.user_histories.get(user_idx, set())
        
        while len(neg_items) < self.num_negatives:
            rand_item = np.random.randint(0, self.total_items)
            if rand_item not in user_history:
                neg_items.append(rand_item)

        return (
            torch.tensor(user_idx, dtype=torch.long),
            torch.tensor(pos_item_idx, dtype=torch.long),
            torch.tensor(neg_items, dtype=torch.long),
            torch.tensor(weight, dtype=torch.float32)
        )

# --- 2. ARCHITECTURE & LOSS ---
class TwoTowerRecommender(nn.Module):
    def __init__(self, num_users, num_items, pretrained_embeddings_path, embedding_dim=64):
        super(TwoTowerRecommender, self).__init__()
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        
        print("Loading offline text embeddings into the Item Tower...")
        np_embeddings = np.load(pretrained_embeddings_path)
        self.item_text_embedding = nn.Embedding.from_pretrained(torch.tensor(np_embeddings, dtype=torch.float32), freeze=True)
        
        self.text_projection = nn.Sequential(
            nn.Linear(384, 128), nn.ReLU(), nn.Linear(128, embedding_dim)
        )
        self.item_id_embedding = nn.Embedding(num_items, embedding_dim)
        
    def get_user_vector(self, user_idx): return self.user_embedding(user_idx)
        
    def get_item_vector(self, item_idx):
        return self.text_projection(self.item_text_embedding(item_idx)) + self.item_id_embedding(item_idx)

    def forward(self, user_idx, pos_item_idx, neg_item_indices):
        user_vec = self.get_user_vector(user_idx)
        pos_item_vec = self.get_item_vector(pos_item_idx)
        neg_item_vecs = self.get_item_vector(neg_item_indices)
        
        pos_scores = (user_vec * pos_item_vec).sum(dim=1)
        neg_scores = torch.bmm(neg_item_vecs, user_vec.unsqueeze(2)).squeeze(2)
        return pos_scores, neg_scores

def bpr_loss(pos_scores, neg_scores, weights):
    difference = pos_scores.unsqueeze(1).expand_as(neg_scores) - neg_scores
    loss = -torch.log(torch.sigmoid(difference) + 1e-8)
    return (loss * weights.unsqueeze(1).expand_as(loss)).mean()

# --- 3. EXECUTION LOOP ---
if __name__ == "__main__":
    dataset = FoodInteractionDataset("interactions.csv", "items.csv")
    dataloader = DataLoader(dataset, batch_size=256, shuffle=True)
    
    model = TwoTowerRecommender(
        num_users=len(dataset.user_encoder.classes_),
        num_items=len(dataset.item_encoder.classes_),
        pretrained_embeddings_path="new_item_embeddings.npy" # MUST MATCH PHASE 1
    )

    optimizer = optim.Adam(model.parameters(), lr=0.001)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    print("\nStarting Training...")
    for epoch in range(5):
        model.train()
        total_loss, start_time = 0, time.time()
        for u, p, n, w in dataloader:
            u, p, n, w = u.to(device), p.to(device), n.to(device), w.to(device)
            optimizer.zero_grad()
            pos, neg = model(u, p, n)
            loss = bpr_loss(pos, neg, w)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            
        print(f"Epoch {epoch+1}/5 | Loss: {total_loss/len(dataloader):.4f} | Time: {time.time()-start_time:.2f}s")

    print("\nExtracting Final Vectors...")
    model.eval()
    final_embeddings = []
    with torch.no_grad():
        for i in range(len(dataset.item_encoder.classes_)):
            vec = model.get_item_vector(torch.tensor([i]).to(device)).cpu().numpy()[0]
            final_embeddings.append(vec)
            
    np.save("final_backend_embeddings.npy", np.array(final_embeddings))
    print("SUCCESS: Saved 'final_backend_embeddings.npy'. Rename this to 'item_embeddings.npy' and drop it in your backend.")