import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected value: ${selectedValue}`);
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
          <label htmlFor="dropdown">Choose an option:</label>
          <select id="dropdown" value={selectedValue} onChange={handleChange}>
            <option value="">-- Select an option --</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
          <button type="submit">Submit</button>
        </form>
        {/* Dropdown form ends here */}
      </header>
    </div>
  );
}

export default App;
