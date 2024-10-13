import React, { useState } from 'react';
import './App.css';
import carData from './makemodel.json'; // Assuming JSON is stored locally
import axios from 'axios'; // query the backend
import { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph } from './2dGraphs';
import PriceOdometerTime3DGraph from './PriceOdometerTime3DGraph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [results, setResults] = useState([]); // To store the query results of sold cars
  const [unsoldCars, setUnsoldCars] = useState([]);  // To store the unsold Subaru cars

  // Fetch unsold cars after submit
  const fetchUnsoldCars = async () => {
    try {
      const response = await axios.post('https://carsalesignal.com/api/unsold-dreams');
      console.log('Unsold Query Result:', response.data);
      setUnsoldCars(best_deal(response.data));  // Sort by best_deal
    } catch (error) {
      console.error('Error fetching unsold cars:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://carsalesignal.com/api/sold-dreams');
      console.log('Sold Query Result:', response.data);
      setResults(response.data); // Set the response data into state
      fetchUnsoldCars();  // Fetch unsold cars after sold cars
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
      <header className="App-header">
        <p>Push the button to see Subaru's!</p>
        <a className="App-link" href="mailto:cadocary@gmail.com" target="_blank" rel="noopener noreferrer">
          Contact
        </a>

        {/* Button to trigger fetch */}
        <button onClick={handleSubmit} className="submit-button">
          Push Button to see Subaru's
        </button>

        {/* Render the graphs if results are available */}
        {results.length > 0 && (
          <>
            <PriceDurationGraph listings={results} />
            <PriceOdometerGraph listings={results} />
            <OdometerTimeGraph listings={results} />
            <PriceOdometerTime3DGraph listings={results} />
          </>
        )}

        {/* Display results in a table */}
        {results.length > 0 && (
          <div className="table-container">
            <h2>Cars Sold in the past, the Input Data to the Graphs</h2>
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
                  <th>Link</th>  {/* New link column */}
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
                        <FontAwesomeIcon icon={faLink} />  {/* Font Awesome icon */}
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
  );
}

export default App;
