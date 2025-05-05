import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const checkNews = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/predict', { text });
      setResult(res.data.prediction);
      setError('');
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setResult('');
    }
  };

  const fetchHistory = async () => {
    const res = await axios.get('http://localhost:5000/api/history');
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">📰 Fake News Detector</h2>
        <textarea
          rows="5"
          className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter news text here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={checkNews}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Check
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {result && (
          <h3 className="text-lg font-semibold text-center text-green-600 mt-4">
            Result: {result}
          </h3>
        )}

        <h4 className="text-lg font-bold text-gray-700 mt-8">🔍 History</h4>
        <div className="flex justify-between items-center mt-4">
          <h5 className="text-gray-600">Previous Checks:</h5>
          <button
            onClick={async () => {
              await axios.post('http://localhost:5000/api/clear_history');
              setHistory([]);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Clear History
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {history.map((item, index) => (
            <li
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
            >
              <strong className="text-blue-600">{item.prediction}</strong>: {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
