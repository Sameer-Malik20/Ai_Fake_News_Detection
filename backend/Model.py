import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os

# 1. Load CSV dataset
file_path = os.path.join(os.path.dirname(__file__), "news.csv")  # Ensure correct file path
try:
    df = pd.read_csv(file_path, encoding='utf-8', on_bad_lines='skip')  # Skip bad rows
except FileNotFoundError:
    print(f"Error: The file 'news.csv' was not found at {file_path}")
    exit(1)
except Exception as e:
    print(f"Error reading the file: {e}")
    exit(1)

# Ensure the required columns exist
if 'text' not in df.columns or 'label' not in df.columns:
    print("Error: The dataset must contain 'text' and 'label' columns.")
    exit(1)

x = df['text']
y = df['label']

# 2. Create pipeline (TF-IDF + Logistic Regression)
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', max_df=0.7)),
    ('clf', LogisticRegression())
])

# 3. Train the model
pipeline.fit(x, y)

# 4. Save the model
joblib.dump(pipeline, 'model.pkl')

print("Model trained and saved")