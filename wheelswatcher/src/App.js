import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import carData from './makemodel.json'; // Assuming JSON is stored locally

function App() {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  // List of areas for the area dropdown
  const areas = [
    "auburn", "bham", "dothan", "shoals", "gadsden", "huntsville", "mobile", "montgomery", "tuscaloosa",
    "anchorage", "fairbanks", "kenai", "juneau", "flagstaff", "mohave", "phoenix", "prescott", "showlow",
    "sierravista", "tucson", "yuma", "fayar", "fortsmith", "jonesboro", "littlerock", "texarkana",
    // Add more areas as needed...
  ];

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel(''); // Reset model when make changes
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected Area: ${selectedArea}, Make: ${selectedMake}, Model: ${selectedModel}`);
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
          {/* Area Dropdown */}
          <label htmlFor="areaDropdown">Choose an area:</label>
          <select id="areaDropdown" value={selectedArea} onChange={handleAreaChange}>
            <option value="">-- Select an area --</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Make Dropdown */}
          <label htmlFor="makeDropdown">Select Make:</label>
          <select id="makeDropdown" value={selectedMake} onChange={handleMakeChange}>
            <option value="">-- Choose Make --</option>
            {Object.keys(carData).map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          {/* Model Dropdown (conditionally rendered) */}
          {selectedMake && (
            <>
              <label htmlFor="modelDropdown">Select Model:</label>
              <select id="modelDropdown" value={selectedModel} onChange={handleModelChange}>
                <option value="">-- Choose Model --</option>
                {carData[selectedMake].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit">Submit</button>
        </form>
        {/* Dropdown form ends here */}
      </header>
    </div>
  );
}

export default App;
