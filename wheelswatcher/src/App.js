import React, { useState } from 'react';
import './App.css';
import carData from './makemodel.json'; // Assuming JSON is stored locally
import axios from 'axios'; // query the backend
import { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph } from './2dGraphs';
import PriceOdometerTime3DGraph from './PriceOdometerTime3DGraph';

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
      <div className="container">
        <header className="App-header">
          <p>
            <a className="App-link" href="mailto:cadocary@gmail.com" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
          </p>
          <div className="intro-box">
            <p>I have a database of cars that have already sold, and cars that are currently available.</p>
            <p>First, I'm going to select the cars that have already sold; it'll be 2001-2010 Subaru Outbacks with the 6-cylinder engine.</p>
            <p>I'll show the results with the price, year, odometer, and how long the listing was up before being sold in a table so you can see the data.</p>
            <p>Then I'll show graphs of the price vs odometer vs days listed, so you can easily picture what the good deals are.</p>
            <p>Finally, I'll check the database again and show you all of the similar 6cyl '01-'10 Subaru Outbacks currently available in WA, with links to the ads.</p>
          </div>

          {/* Button to trigger fetch */}
          <button onClick={handleSubmit} className="submit-button">
            See Subaru's
          </button>

          {/* Display sold cars in a table */}
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

          {/* Render the graphs if results are available */}
          {results.length > 0 && (
            <>
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
      </div>{/* Your content here */}
    </div>
  );
}

export default App;
