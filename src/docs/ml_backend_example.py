
# Example Python ML backend implementation with FastAPI
# This file is for reference only and won't be used by the React app

from fastapi import FastAPI, Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

app = FastAPI(
    title="Lead Scoring API",
    description="ML-based API for lead conversion prediction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Security
API_KEY = "your-secret-api-key"
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

def get_api_key(api_key: str = Security(api_key_header)):
    if api_key == API_KEY:
        return api_key
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid API Key"
    )

# Data Models
class Lead(BaseModel):
    id: Optional[int]
    name: str
    company: str
    industry: str
    size: str
    lastContact: str
    email: Optional[str]
    position: Optional[str]
    budget: Optional[float]
    previousPurchases: Optional[int]
    interactions: Optional[int]

class PredictionRequest(BaseModel):
    leads: List[Lead]
    modelType: str = "random-forest"  # Options: logistic-regression, random-forest, neural-network

class PredictionResponse(BaseModel):
    predictions: List[dict]
    featureImportance: List[dict]
    modelMetrics: dict
    clusterAnalysis: Optional[List[dict]]

# Machine Learning Model
class LeadScoringModel:
    def __init__(self):
        # In a real app, models would be pre-trained and loaded from storage
        self.models = {
            "logistic-regression": LogisticRegression(),
            "random-forest": RandomForestClassifier(),
            # Neural network would use TensorFlow/PyTorch
        }
        self.scaler = StandardScaler()
        self.feature_names = [
            "days_since_contact", "budget", "previous_purchases", 
            "interactions", "company_size_encoded", "industry_encoded"
        ]
        
    def preprocess_data(self, leads):
        # Convert lead data to features
        # In a real app, this would involve more sophisticated preprocessing
        df = pd.DataFrame([
            {
                "id": lead.id,
                "name": lead.name,
                "company": lead.company,
                "days_since_contact": self._days_since_contact(lead.lastContact),
                "budget": lead.budget or np.random.randint(1000, 50000),
                "previous_purchases": lead.previousPurchases or np.random.randint(0, 5),
                "interactions": lead.interactions or np.random.randint(1, 20),
                "company_size_encoded": self._encode_company_size(lead.size),
                "industry_encoded": self._encode_industry(lead.industry),
            }
            for lead in leads
        ])
        
        features = df[self.feature_names].values
        scaled_features = self.scaler.fit_transform(features)
        
        return df, scaled_features
    
    def _days_since_contact(self, date_str):
        # In a real app, calculate actual days since last contact
        import random
        return random.randint(1, 60)
    
    def _encode_company_size(self, size):
        sizes = {"small": 1, "medium": 2, "large": 3, "enterprise": 4}
        return sizes.get(size.lower(), 2)
    
    def _encode_industry(self, industry):
        industries = {
            "technology": 1, "healthcare": 2, "finance": 3, 
            "education": 4, "manufacturing": 5, "retail": 6
        }
        return industries.get(industry.lower(), 0)
    
    def train_model(self, model_type):
        # In production, models would be trained offline
        # This is just a simulation
        X = np.random.rand(1000, len(self.feature_names))
        y = (np.random.rand(1000) > 0.5).astype(int)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        model = self.models[model_type]
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        metrics = {
            "accuracy": accuracy_score(y_test, y_pred),
            "precision": precision_score(y_test, y_pred),
            "recall": recall_score(y_test, y_pred),
            "f1Score": f1_score(y_test, y_pred)
        }
        
        return model, metrics
    
    def predict(self, leads, model_type="random-forest"):
        df, features = self.preprocess_data(leads)
        
        # In production, we would load a pre-trained model
        # For demo purposes, we'll train on the fly
        model, metrics = self.train_model(model_type)
        
        # Get predictions
        probabilities = model.predict_proba(features)[:, 1]
        
        # Get feature importance (for tree-based models)
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            feature_importance = [
                {"name": name, "value": float(importance)}
                for name, importance in zip(self.feature_names, importances)
            ]
        else:
            # For models without feature_importances_
            feature_importance = [
                {"name": "Last Contact Recency", "value": 0.32},
                {"name": "Budget Size", "value": 0.27},
                {"name": "Previous Purchases", "value": 0.18},
                {"name": "Company Size", "value": 0.15},
                {"name": "Industry", "value": 0.08}
            ]
        
        # Prepare prediction results
        predictions = []
        for i, lead in enumerate(leads):
            prob = float(probabilities[i])
            predictions.append({
                "id": lead.id or i,
                "name": lead.name,
                "company": lead.company,
                "industry": lead.industry,
                "size": lead.size,
                "conversionProbability": prob,
                "score": int(prob * 100),
                "lastContact": lead.lastContact
            })
        
        # Simulated cluster analysis (would use KMeans in production)
        clusters = [
            {"x": 35, "y": 28, "z": 20, "name": "Low Value, High Volume"},
            {"x": 65, "y": 82, "z": 40, "name": "High Value, Low Volume"},
            {"x": 55, "y": 45, "z": 30, "name": "Medium Value, Medium Volume"},
            {"x": 70, "y": 78, "z": 15, "name": "High Value, High Volume"},
            {"x": 30, "y": 15, "z": 25, "name": "Low Value, Low Volume"}
        ]
        
        return {
            "predictions": predictions,
            "featureImportance": feature_importance,
            "modelMetrics": metrics,
            "clusterAnalysis": clusters
        }

# Initialize ML model
lead_scoring_model = LeadScoringModel()

# API Routes
@app.post("/api/predict", response_model=PredictionResponse)
async def predict_leads(
    request: PredictionRequest,
    api_key: str = Depends(get_api_key)
):
    """
    Predict lead conversion probabilities using machine learning
    """
    try:
        result = lead_scoring_model.predict(request.leads, request.modelType)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "version": "1.0.0"}

# Run the API with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
