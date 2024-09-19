import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseBody, setResponseBody] = useState<any>(null); // To store the response body

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      
      const response = await fetch('http://localhost:5000/api/material-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lookup: inputValue }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setResponseMessage('Success: Data submitted successfully');
      } else {
        setResponseMessage(`Error: ${response.statusText}`);
      }

      setResponseBody(responseData);
    } catch (error) {
      console.error('Error submitting data:', error);
      setResponseMessage('Error submitting data. Please try again.');
      setResponseBody(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {/* Input Box and Submit Button */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="lookup"
            value={inputValue}
            onChange={handleInputChange}
            className="lookup-input"
          />
          <button type="submit" className="lookup-button">Submit</button>
        </form>

        {/* Display the response message */}
        {responseMessage && <p>{responseMessage}</p>}

        {/* Display the body of the response */}
        {responseBody && (
          <div>
            <h3>Response Body:</h3>
            <pre>{JSON.stringify(responseBody, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
