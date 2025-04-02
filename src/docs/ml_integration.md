
# Machine Learning Integration Documentation

This document explains how the React frontend integrates with the Python machine learning backend for lead scoring functionality.

## Architecture Overview

```
+------------------+          +------------------+          +------------------+
|                  |  HTTP/   |                  |          |                  |
|  React Frontend  |  REST    |  Python API      |  Uses    |  ML Models       |
|  (TypeScript)    +--------->+  (FastAPI)       +--------->+  (TensorFlow/    |
|                  |          |                  |          |   scikit-learn)  |
+------------------+          +------------------+          +------------------+
```

## Frontend Components

- **LeadScoring.tsx**: Main dashboard that displays ML predictions and insights
- **LeadList.tsx**: Provides navigation to the ML scoring dashboard

## Backend Components (Python)

- **FastAPI Application**: REST API for serving predictions
- **ML Models**: TensorFlow/PyTorch models for lead conversion prediction
- **Data Processing**: pandas for ETL and preprocessing
- **Model Training**: scikit-learn for traditional ML algorithms

## API Integration

The frontend makes REST API calls to the Python backend with the following endpoints:

### 1. Predict Lead Conversion

**Endpoint**: `POST /api/predict`

**Request**:
```json
{
  "leads": [
    {
      "id": 1,
      "name": "John Doe",
      "company": "ABC Corp",
      "industry": "Technology",
      "size": "medium",
      "lastContact": "2023-06-15",
      "budget": 25000,
      "previousPurchases": 2,
      "interactions": 8
    },
    ...
  ],
  "modelType": "random-forest" 
}
```

**Response**:
```json
{
  "predictions": [
    {
      "id": 1,
      "name": "John Doe",
      "company": "ABC Corp",
      "industry": "Technology", 
      "size": "medium",
      "conversionProbability": 0.82,
      "score": 82,
      "lastContact": "2023-06-15"
    },
    ...
  ],
  "featureImportance": [
    {
      "name": "Last Contact Recency",
      "value": 0.32
    },
    ...
  ],
  "modelMetrics": {
    "accuracy": 0.85,
    "precision": 0.83,
    "recall": 0.79,
    "f1Score": 0.81
  },
  "clusterAnalysis": [
    {
      "x": 35,
      "y": 28,
      "z": 20,
      "name": "Low Value, High Volume"
    },
    ...
  ]
}
```

## Security Considerations

- API Key authentication for backend requests
- HTTPS/TLS encryption for all API calls
- Input validation on both frontend and backend
- Rate limiting to prevent abuse

## Machine Learning Pipeline

1. **Data Collection**: Customer data from CRM system
2. **Preprocessing**: Handle missing values, normalize features
3. **Feature Engineering**: Create meaningful features from raw data
4. **Model Training**: Train various models (logistic regression, random forest, etc.)
5. **Evaluation**: Assess model performance using metrics like accuracy, precision, recall
6. **Deployment**: Serve the model through FastAPI

## Future Enhancements

1. **Real-time Updates**: WebSockets for live prediction updates
2. **A/B Testing**: Compare different ML models performance
3. **Explainable AI**: More detailed explanations of predictions
4. **Feedback Loop**: Use sales outcomes to retrain and improve models
5. **Batch Processing**: Support for bulk lead scoring
