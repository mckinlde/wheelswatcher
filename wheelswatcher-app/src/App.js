import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import {
  PriceDurationGraph,
  OdometerTimeGraph,
  PriceOdometerGraph,
  VolumeGraph
} from './2dGraphs';
import { AboutPage } from './components/About'; // 🆕

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // 🆕
  const [volumeData, setVolumeData] = useState(null); // 🆕

  const fetchUnsoldCars = async (make, model, startYear, endYear, bodyTermsArray) => {
    try {
      await axios.post('https://carsalesignal.com/api/unsold-parameterized', {
        make, model, startYear, endYear, bodyTerms: bodyTermsArray
      });
    } catch (error) {
      console.error('Error fetching unsold cars:', error);
    }
  };

  const fetchVolumeData = async (make, model, startYear, endYear) => {
    try {
      const response = await axios.post('https://carsalesignal.com/api/volume-stats', {
        make, model, startYear, endYear
      });
      setVolumeData(response.data);
    } catch (error) {
      console.error('Error fetching volume stats:', error);
      setVolumeData(null);
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
      setSidebarOpen(false);

      fetchUnsoldCars(lowercasedMake, lowercasedModel, startYear, endYear, bodyTermsArray);
      fetchVolumeData(lowercasedMake, lowercasedModel, startYear, endYear); // 🆕
    } catch (error) {
      console.error('Error querying the database:', error);
    }
  };

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

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
          <label>
            Area:
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                value="Atlanta"
                readOnly
                style={{ flex: 1 }}
              />
              <span role="img" aria-label="locked">🔒</span>
            </div>
          </label>

          {/* <label>Body Terms:
            <input type="text" value={bodyTerms} onChange={(e) => setBodyTerms(e.target.value)} />
          </label> */}
          <label>Access Code:
            <input type="password" value={access_code} onChange={(e) => setAccessCode(e.target.value)} />
          </label>
          <button type="submit">Submit</button>
        </form>

        <button type="button" className="form-button full-width" onClick={() => setShowAbout(!showAbout)}>
          {showAbout ? 'Back to Dashboard' : 'About'}
        </button>

      </aside>

      <main className="main-content">
        {showAbout ? (
          <AboutPage />
        ) : (
          <>
            <div className="intro-box">
              <p>
                <strong>CarSaleSignal:</strong> the automotive MLS that gives small dealerships and individual buyers an unfair information advantage over big players like KBB and Penske.
              </p>
            </div>

            {results.length > 0 && (
              <>
                <div className="graph-grid">
                  <div className="graph-tile"><PriceDurationGraph listings={results} /></div>
                  <div className="graph-tile"><PriceOdometerGraph listings={results} /></div>
                  <div className="graph-tile"><OdometerTimeGraph listings={results} /></div>
                  <div className="graph-tile">
                    {volumeData ? (
                      <VolumeGraph volumeData={volumeData} />
                    ) : (
                      <p>Loading volume data…</p>
                    )}
                  </div>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;


// === After updating this file ===
// # From project root
// # First Time
// chmod +x ~/wheelswatcher/wheelswatcher-app/deploy.sh
// ./wheelswatcher/wheelswatcher-app/deploy.sh

// # Following Updates
// ./wheelswatcher/wheelswatcher-app/deploy.sh