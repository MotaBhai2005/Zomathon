# Zomathon AI: Two-Stage Hybrid Recommendation Engine (Backend)

This repository contains the FastAPI backend and the Machine Learning training pipeline for our cart-level intelligent cross-selling engine. 

Instead of relying on basic string matching, we engineered a **Two-Stage Architecture**:
1. **Behavioral Recall (PyTorch Two-Tower):** Learns implicit user interaction patterns.
2. **Taxonomical Precision (Knowledge Graph):** Uses PageRank to enforce strict culinary and structural laws (e.g., preventing cross-cuisine mixing and temperature clashes).

## 🚀 Running the API Server Locally

### Prerequisites
Ensure you have Python 3.9+ installed. You can install all backend dependencies by running the following command from this directory:

```bash
pip install -r requirements.txt
```

### Start the Server

Start the FastAPI application. It will load the pre-trained `final_backend_embeddings.npy` and the `items.csv` catalog into memory. Ensure you have downloaded these files into this folder before starting. (The files are provided in the drive link in the main README.md)

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## 🧠 Model Training Pipeline

If you wish to retrain the model locally from scratch, we have isolated the scripts in the `/training_pipeline` directory. The ML pipeline has its own set of dependencies.

```bash
cd training_pipeline
pip install -r requirements.txt
```

> **⚠️ Note for GPU Acceleration:** The `requirements.txt` installs the default PyTorch binaries. To train the Two-Tower model using CUDA (Nvidia GPU), please install the specific PyTorch wheel for your system from the official PyTorch website before running the training script.

### Step 1: Generate the Taxonomical Catalog

Ensure `restaurants.csv` is present in the `training_pipeline` directory. This script categorizes base items and distributes them across restaurants, outputting `items.csv`.

```bash
python generate_catalog.py
```

### Step 2: Simulate Implicit Behavior

Simulates 100,000 highly structured user interactions based on strict culinary personas to provide dense behavioral data, outputting `interactions.csv`.

```bash
python simulate_interactions.py
```

### Step 3: Train the Neural Network

*Note: Requires PyTorch and sentence-transformers.*

Extracts HuggingFace NLP vectors from item descriptions, trains a Dual-Encoder model using Bayesian Personalized Ranking (BPR) loss, and automatically deploys the final `items.csv` and `final_backend_embeddings.npy` to the backend root.

```bash
python train_twotower.py
```