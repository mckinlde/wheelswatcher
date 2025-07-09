import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph } from './2dGraphs';
import PriceOdometerTime3DGraph from './PriceOdometerTime3DGraph';

function App() {
  const [access_code, setAccessCode] = useState('');
  const [make, setMake] = useState('ford');
  const [model, setModel] = useState('f150');
  const [startYear, setStartYear] = useState(2001);
  const [endYear, setEndYear] = useState(2010);
  const [bodyTerms, setBodyTerms] = useState('');
  const [results, setResults] = useState([
    {
      "added": "2024-10-02T07:45:59.740147",
      "odometer": "not found",
      "price": "$6,150",
      "title": "2001 ford f150",
      "updated": "2024-10-23T07:54:04.776716",
      "year": "2001"
    },
  ]);
  const [unsoldCars, setUnsoldCars] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUnsoldCars = async (make, model, startYear, endYear, bodyTermsArray) => {
    try {
      const response = await axios.post('https://carsalesignal.com/api/unsold-parameterized', {
        make, model, startYear, endYear, bodyTerms: bodyTermsArray
      });
      setUnsoldCars(best_deal(response.data));
    } catch (error) {
      console.error('Error fetching unsold cars:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (access_code !== 'fuckKBB') {
      alert("Invalid access code.");
      return;
    }

    const lowercasedMake = make.toLowerCase();
    const lowercasedModel = model.toLowerCase();
    const bodyTermsArray = bodyTerms.split(',').map(term => term.trim().toLowerCase()).filter(Boolean);

    try {
      const response = await axios.post('https://carsalesignal.com/api/sold-parameterized', {
        make: lowercasedMake,
        model: lowercasedModel,
        startYear,
        endYear,
        bodyTerms: bodyTermsArray
      });
      setResults(response.data);
      fetchUnsoldCars(lowercasedMake, lowercasedModel, startYear, endYear, bodyTermsArray);
      setSidebarOpen(false); // Optional: auto-close on submit
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

    const safeDiv = (num, denom) => denom === 0 ? 0 : num / denom;

    return cars.sort((a, b) => {
      const scoreA = safeDiv(parsePrice(a.price) - priceMin, priceMax - priceMin) * 0.3 +
                     safeDiv(parseInt(a.odometer, 10) - odometerMin, odometerMax - odometerMin) * 0.4 -
                     safeDiv(parseInt(a.year, 10) - yearMin, yearMax - yearMin) * 0.3;

      const scoreB = safeDiv(parsePrice(b.price) - priceMin, priceMax - priceMin) * 0.3 +
                     safeDiv(parseInt(b.odometer, 10) - odometerMin, odometerMax - odometerMin) * 0.4 -
                     safeDiv(parseInt(b.year, 10) - yearMin, yearMax - yearMin) * 0.3;

      return scoreA - scoreB;
    });
  }

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      
      {/* Mobile Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>Search Cars</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>Make:
            <input type="text" value={make} onChange={(e) => setMake(e.target.value)} />
          </label>
          <label>Model:
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} />
          </label>
          <label>Start Year:
            <input type="number" value={startYear} onChange={(e) => setStartYear(e.target.value)} />
          </label>
          <label>End Year:
            <input type="number" value={endYear} onChange={(e) => setEndYear(e.target.value)} />
          </label>
          {/* <label>Body Terms:
            <input type="text" value={bodyTerms} onChange={(e) => setBodyTerms(e.target.value)} />
          </label> */}
          <label>Access Code:
            <input type="password" value={access_code} onChange={(e) => setAccessCode(e.target.value)} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="intro-box">
          <p>
            Welcome to CarSaleSignal: built to give small dealerships and individual buyers a real edge over big players.
          </p>
        </div>

        {results.length > 0 && (
          <>
            <div className="graph-grid">
              <div className="graph-tile"><PriceDurationGraph listings={results} /></div>
              <div className="graph-tile"><PriceOdometerGraph listings={results} /></div>
              <div className="graph-tile"><OdometerTimeGraph listings={results} /></div>
              <div className="graph-tile placeholder"><p>More to come...</p></div>
            </div>

            <h2>Source Data</h2>
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
          </>
        )}

        <footer style={{ marginTop: '2rem' }}>
          <p>Contact: <a className="App-link" href="mailto:cadocary@gmail.com">cadocary@gmail.com</a></p>
        </footer>
      </main>
    </div>
  );
}

export default App;

// === After updating this file ===
// # From project root
// cd ~/wheelswatcher/wheelswatcher-app
// git pull origin main

// # Rebuild frontend if needed
// npm install
// npm run build

// # Restart service
// sudo systemctl restart wheelswatcher-combined 