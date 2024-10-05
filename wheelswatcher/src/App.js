import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [selectedValue, setSelectedValue] = useState('');

  const areas = ["auburn", "bham", "dothan"];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected area: ${selectedValue}`);
  };

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* Dropdown form starts here */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="dropdown">Choose an area:</label>
          <select id="dropdown" value={selectedValue} onChange={handleChange}>
            <option value="">-- Select an area --</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
        </form>
        {/* Dropdown form ends here */}
      </header>
    </div>
  );
}

export default App;
