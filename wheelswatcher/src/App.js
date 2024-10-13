import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import carData from './makemodel.json'; // Assuming JSON is stored locally

// todo: query the backend
import axios from 'axios';




function App() {
  const [selectedArea, setSelectedArea] = useState('');
  // const [selectedMake, setSelectedMake] = useState('');
  // const [selectedModel, setSelectedModel] = useState('');

  const areas = [
    "auburn", "bham", "dothan", "shoals", "gadsden", "huntsville", "mobile", "montgomery", "tuscaloosa",
    "anchorage", "fairbanks", "kenai", "juneau", "flagstaff", "mohave", "phoenix", "prescott", "showlow",
    // Add more areas as needed...
  ];

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  // const handleMakeChange = (e) => {
  //   setSelectedMake(e.target.value);
  //   setSelectedModel(''); // Reset model when make changes
  // };

  // const handleModelChange = (e) => {
  //   setSelectedModel(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Selected Area: ${selectedArea}, Make: ${selectedMake}, Model: ${selectedModel}`);
  
    try {
      const response = await axios.post('https://carsalesignal.com/api/query-listings', {
        area: selectedArea,
        // make: selectedMake,
        // model: selectedModel,
      });
  
      console.log('Query Result:', response.data);
    } catch (error) {
      console.error('Error querying the database:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Select an area, make, and model to see the cars that have sold.
        </p>
        <a
          className="App-link"
          href="mailto:cadocary@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact
        </a>

        {/* Enhanced Dropdown Form */}
        <form onSubmit={handleSubmit} className="dropdown-form">
          {/* Area Dropdown */}
          <label htmlFor="areaDropdown" className="dropdown-label">Choose an area:</label>
          <select id="areaDropdown" value={selectedArea} onChange={handleAreaChange} className="dropdown">
            <option value="">-- Select an area --</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Make Dropdown */}
          {/* <label htmlFor="makeDropdown" className="dropdown-label">Select Make:</label>
          <select id="makeDropdown" value={selectedMake} onChange={handleMakeChange} className="dropdown">
            <option value="">-- Choose Make --</option>
            {Object.keys(carData).map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select> */}

          {/* Model Dropdown (conditionally rendered) */}
          {/* {selectedMake && (
            <>
              <label htmlFor="modelDropdown" className="dropdown-label">Select Model:</label>
              <select id="modelDropdown" value={selectedModel} onChange={handleModelChange} className="dropdown">
                <option value="">-- Choose Model --</option>
                {carData[selectedMake].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </>
          )} */}

          <button type="submit" className="submit-button">Submit</button>
        </form>
        {/* End of Enhanced Dropdown Form */}
      </header>
    </div>
  );
}

export default App;
