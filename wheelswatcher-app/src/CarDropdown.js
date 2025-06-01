import React, { useState } from 'react';
import carData from './public/makemodel.json'; // Assuming JSON is stored locally

function CarDropdown() {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel(''); // Reset model when make changes
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <div>
      <label>
        Select Make:
        <select value={selectedMake} onChange={handleMakeChange}>
          <option value="">--Choose Make--</option>
          {Object.keys(carData).map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </label>

      {selectedMake && (
        <label>
          Select Model:
          <select value={selectedModel} onChange={handleModelChange}>
            <option value="">--Choose Model--</option>
            {carData[selectedMake].map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

export default CarDropdown;