import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph } from './2dGraphs';
import PriceOdometerTime3DGraph from './PriceOdometerTime3DGraph';

function App() {
  const [make, setMake] = useState('ford');
  const [model, setModel] = useState('f150');
  const [startYear, setStartYear] = useState(2001);
  const [endYear, setEndYear] = useState(2010);
  const [bodyTerms, setBodyTerms] = useState('');
  const [results, setResults] = useState([]);
  const [unsoldCars, setUnsoldCars] = useState([]);

  const fetchUnsoldCars = async (make, model, startYear, endYear, bodyTermsArray) => {
    try {
      const response = await axios.post('https://carsalesignal.com/api/unsold-parameterized', {
        make,
        model,
        startYear,
        endYear,
        bodyTerms: bodyTermsArray
      });
      setUnsoldCars(best_deal(response.data));
    } catch (error) {
      console.error('Error fetching unsold cars:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowercasedMake = make.toLowerCase();
    const lowercasedModel = model.toLowerCase();
    const bodyTermsArray = bodyTerms.split(',')
      .map(term => term.trim().toLowerCase())
      .filter(term => term);

    try {
      const response = await axios.post('https://carsalesignal.com/api/sold-parameterized', {
        make: lowercasedMake,
        model: lowercasedModel,
        startYear,
        endYear,
        bodyTerms: bodyTermsArray
      });
      setResults(response.data);
      console.log(response.data)
      fetchUnsoldCars(lowercasedMake, lowercasedModel, startYear, endYear, bodyTermsArray);
    } catch (error) {
      console.error('Error querying the database:', error);
    }
  };

  function best_deal(cars) {
    const parsePrice = (price) => parseInt(price.replace(/[^0-9]/g, ''), 10);
    const priceMin = Math.min(...cars.map(car => parsePrice(car.price)));
    const priceMax = Math.max(...cars.map(car => parsePrice(car.price)));
    const odometerMin = Math.min(...cars.map(car => parseInt(car.odometer, 10)));
    const odometerMax = Math.max(...cars.map(car => parseInt(car.odometer, 10)));
    const yearMin = Math.min(...cars.map(car => parseInt(car.year, 10)));
    const yearMax = Math.max(...cars.map(car => parseInt(car.year, 10)));

    return cars.sort((a, b) => {
      const normalizedPriceA = (parsePrice(a.price) - priceMin) / (priceMax - priceMin || 1);
      const normalizedOdometerA = (parseInt(a.odometer, 10) - odometerMin) / (odometerMax - odometerMin || 1);
      const normalizedYearA = (parseInt(a.year, 10) - yearMin) / (yearMax - yearMin || 1);

      const normalizedPriceB = (parsePrice(b.price) - priceMin) / (priceMax - priceMin || 1);
      const normalizedOdometerB = (parseInt(b.odometer, 10) - odometerMin) / (odometerMax - odometerMin || 1);
      const normalizedYearB = (parseInt(b.year, 10) - yearMin) / (yearMax - yearMin || 1);

      const scoreA = normalizedPriceA * 0.3 + normalizedOdometerA * 0.4 - normalizedYearA * 0.3;
      const scoreB = normalizedPriceB * 0.3 + normalizedOdometerB * 0.4 - normalizedYearB * 0.3;

      return scoreA - scoreB;
    });
  }

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <p>
            Contact: 
            <a className="App-link" href="mailto:cadocary@gmail.com" target="_blank" rel="noopener noreferrer">
              cadocary@gmail.com
            </a>
          </p>
          <div className="intro-box">
            <p>
              Welcome to CarSaleSignal; where I try to give small dealerships 
              and individual buyers an unfair information advantage over big players like KBB and Penske.
            </p>
          </div>

          {/* Static Sections */}
          <h2>What is it</h2>
          <p>
            CarSaleSignal is a database of all the used car listings in America 
            that get taken down and marked as sold by the author of the listing.
          </p>

          <h2>How does it work</h2>
          <p>
            CarSaleSignal works from a distributed system of computers in the cloud 
            that collectively read all of Craigslist every night.
          </p>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={`${process.env.PUBLIC_URL}/ezgif.com-gif-maker.gif`}
              alt="Description of the gif"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          </div>

          <h2>Why bother?</h2>
          <p>
            Because trying to figure out whether or not something is a good deal is frustrating! 
            Trade-in values all suck, and nobody trusts KBB--with good reason!
          </p>

          <h2>Can I try it?</h2>
          <p>
            Sure, fill out the form and I'll show you all the matching cars 
            that sold in September 2014 in a neat little table.
          </p>

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
            <button type="submit" className="submit-button">
              Search Cars
            </button>
          </form>

          {/* Render results and graphs */}
          {results.length > 0 && (
            <>
              <h2>Cars Sold in the Past</h2>
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
        </header>
      </div>
    </div>
  );
}

export default App;
