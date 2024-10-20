import React, { useState } from 'react';
import './App.css';
import carData from './makemodel.json'; // Assuming JSON is stored locally
import axios from 'axios'; // query the backend
import { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph } from './2dGraphs';
import PriceOdometerTime3DGraph from './PriceOdometerTime3DGraph';

function App() {
  const [make, setMake] = useState('subaru');
  const [model, setModel] = useState('outback');
  const [startYear, setStartYear] = useState(2001);
  const [endYear, setEndYear] = useState(2010);
  const [bodyTerms, setBodyTerms] = useState('');
  const [results, setResults] = useState([]); // To store the query results of sold cars
  const [unsoldCars, setUnsoldCars] = useState([]);  // To store the unsold Subaru cars

  // Fetch unsold cars after submit
  const fetchUnsoldCars = async (make, model, startYear, endYear, bodyTermsArray) => {
    try {
      const response = await axios.post('https://carsalesignal.com/api/unsold-parameterized', {
        make,
        model,
        startYear,
        endYear,
        bodyTerms: bodyTermsArray
      });
      console.log('Unsold Query Result:', response.data);
      setUnsoldCars(best_deal(response.data));  // Sort by best_deal
    } catch (error) {
      console.error('Error fetching unsold cars:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure all input terms are lowercased
    const lowercasedMake = make.toLowerCase();
    const lowercasedModel = model.toLowerCase();
    const bodyTermsArray = bodyTerms.split(',')
      .map(term => term.trim().toLowerCase())  // Lowercase each term
      .filter(term => term);  // Filter out empty terms
    
    try {
      const response = await axios.post('https://carsalesignal.com/api/sold-parameterized', {
        make: lowercasedMake,
        model: lowercasedModel,
        startYear,
        endYear,
        bodyTerms: bodyTermsArray
      });
      console.log('Sold Query Result:', response.data);
      setResults(response.data); // Set the response data into state
      
      // Fetch unsold cars after sold cars
      fetchUnsoldCars(lowercasedMake, lowercasedModel, startYear, endYear, bodyTermsArray);
    } catch (error) {
      console.error('Error querying the database:', error);
    }
  };  

  // Define a function that scores the cars based on price, odometer, and year
  function best_deal(cars) {
    return cars.sort((a, b) => {
      const scoreA = a.price * 0.4 + a.odometer * 0.3 - a.year * 0.3;
      const scoreB = b.price * 0.4 + b.odometer * 0.3 - b.year * 0.3;
      return scoreA - scoreB;  // Sort in ascending order (best deal first)
    });
  }

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <p>
            <a className="App-link" href="mailto:cadocary@gmail.com" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
          </p>
          <div className="intro-box">
            <p>Welcome to the car listings database. You can now search for cars by choosing a make, model, year range, and specific keywords you'd like to search for in the description.</p>
            <p>The default search is for a 2001-2010 Subaru Outback with a 6cyl engine.</p>
          </div>

          {/* Form to customize the query */}
          <form onSubmit={handleSubmit} className="search-form">
            <label className="form-label">
              Make:
              <input 
                type="text" 
                value={make} 
                onChange={(e) => setMake(e.target.value)} 
                className="form-input" 
              />
            </label>

            <label className="form-label">
              Model:
              <input 
                type="text" 
                value={model} 
                onChange={(e) => setModel(e.target.value)} 
                className="form-input" 
              />
            </label>

            <label className="form-label">
              Start Year:
              <input 
                type="number" 
                value={startYear} 
                onChange={(e) => setStartYear(e.target.value)} 
                className="form-input" 
              />
            </label>

            <label className="form-label">
              End Year:
              <input 
                type="number" 
                value={endYear} 
                onChange={(e) => setEndYear(e.target.value)} 
                className="form-input" 
              />
            </label>

            <label className="form-label">
              Keywords (comma-separated):
              <input 
                type="text" 
                value={bodyTerms} 
                onChange={(e) => setBodyTerms(e.target.value)} 
                className="form-input" 
                placeholder="e.g. AWD, 6cyl"
              />
            </label>

            <button type="submit" className="submit-button">
              Search Cars
            </button>
          </form>

          {/* Display sold cars in a table */}
          {results.length > 0 && (
            <div className="table-container">
              <h2>Cars Sold in the past</h2>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Price</th>
                    <th>Odometer</th>
                    <th>Year</th>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((car, index) => (
                    <tr key={index}>
                      <td>{car.price}</td>
                      <td>{car.odometer}</td>
                      <td>{car.year}</td>
                      <td>{car.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Render the graphs if results are available */}
          {results.length > 0 && (
            <>
            <p>Here are graphs of the cars above, which have already sold. By "Days Listed", we mean how long the listing was up before the car sold and the seller removed the listing.</p>
            <p>Tip: you can click the points to see precise numbers for that point!</p>
              <h2>Price vs Days Listed</h2>
              <PriceDurationGraph listings={results} />
              <h2>Price vs Odometer</h2>
              <PriceOdometerGraph listings={results} />
              <h2>Odometer vs Days Listed</h2>
              <OdometerTimeGraph listings={results} />
              <h2>3D Price vs Odometer & Days Listed</h2>
              <PriceOdometerTime3DGraph listings={results} />
            </>
          )}

          {/* Display unsold cars in a table */}
          {unsoldCars.length > 0 && (
            <div className="table-container">
              <h2>Cars Available in WA</h2>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Price</th>
                    <th>Odometer</th>
                    <th>Year</th>
                    <th>Title</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {unsoldCars.map((car, index) => (
                    <tr key={index}>
                      <td>{car.price}</td>
                      <td>{car.odometer}</td>
                      <td>{car.year}</td>
                      <td>{car.title}</td>
                      <td>
                        <a href={car.url} target="_blank" rel="noopener noreferrer">
                          🔗 {/* Unicode link symbol */}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
