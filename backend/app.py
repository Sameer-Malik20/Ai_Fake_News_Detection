from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)


# Load the model
model = joblib.load('model.pkl')


#load history file or start fresh
history_file ='history.json'
if os.path.exists(history_file):
    with open(history_file,'r') as f:
        history = json.load(f)
else:
    history = []

@app.route('/api/predict', methods=['POST'])  # Added leading slash
def predict():
    data = request.json
    text = data.get('text', '')

    if not text.strip():
        return jsonify({'error': 'No text provided'}), 400
    prediction = model.predict([text])[0]

    result = {
        'text': text,
        'prediction': prediction,
        'timestamp': str(datetime.now())
    }

    history.append(result)

    with open(history_file, 'w') as f:
        json.dump(history, f)
    
    return jsonify({'prediction': prediction})

@app.route('/api/clear_history', methods=['POST'])
def clear_history():
    global history
    history = []
    with open(history_file, 'w') as f:
        json.dump(history, f)
    return jsonify({'message': 'History cleared successfully'})

@app.route('/api/history',methods=['GET'])
def get_history():
    return jsonify(history)

if __name__ == '__main__':
    app.run(debug=True,port=5000)