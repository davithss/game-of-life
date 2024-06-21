// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://floating-garden-93986-ef06767d4d4c.herokuapp.com';

function App() {
  const [initialState, setInitialState] = useState('[[0, 1, 0], [0, 1, 0], [0, 1, 0]]');
  const [boardId, setBoardId] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInitialState(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/board`, { cells: JSON.parse(initialState) });
      console.log('Create Board Response:', res.data);
      setBoardId(res.data.id);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'An error occurred');
      setResponse(null);
    }
  };

  const handleNextState = async () => {
    if (!boardId) {
      setError('Please create a board first.');
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/board/${boardId}/next_state`);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      handleError(err);
    }
  };

  const handleFinalState = async () => {
    if (!boardId) {
      setError('Please create a board first.');
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/board/${boardId}/final_state`);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      setError(`Error: ${err.response.status} - ${err.response.data}`);
    } else if (err.request) {
      // The request was made but no response was received
      setError('Error: No response received from the server.');
    } else {
      // Something happened in setting up the request that triggered an Error
      setError(`Error: ${err.message}`);
    }
    setResponse(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Game of Life API</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder='Enter initial state as JSON (e.g., [[0, 1, 0], [0, 1, 0], [0, 1, 0]])'
            value={initialState}
            onChange={handleInputChange}
            rows="4"
            cols="50"
          />
          <br />
          <button type="submit">Create Board</button>
        </form>
        <button onClick={handleNextState} disabled={!boardId}>Next State</button>
        <button onClick={handleFinalState} disabled={!boardId}>Final State</button>
        {response && (
          <div>
            <h2>API Response</h2>
            <pre>{JSON.stringify(response, null, 4)}</pre>
          </div>
        )}
        {error && (
          <div>
            <h2>Error</h2>
            <pre>{error}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
