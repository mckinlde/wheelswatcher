import React, { useState } from 'react';
import './App.css';
import carData from './makemodel.json'; // Assuming JSON is stored locally
import axios from 'axios'; // query the backend
import { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph } from './2dGraphs';
import PriceOdometerTime3DGraph from './PriceOdometerTime3DGraph';

function App() {
  const [make, setMake] = useState('ford');
  const [model, setModel] = useState('f150');
  const [startYear, setStartYear] = useState(2001);
  const [endYear, setEndYear] = useState(2010);
  const [bodyTerms, setBodyTerms] = useState('');
  const [results, setResults] = useState([]); // To store the query results of sold cars
  const [unsoldCars, setUnsoldCars] = useState([]);  // To store the unsold Subaru cars

  // expandable sectioning
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
      console.log('bodyTermsArray:', bodyTermsArray);
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
  /**
   * To address the imbalance in the scales between price, odometer, and year, we can 
   * normalize each of these values before applying the weights. Normalization typically 
   * involves scaling each value relative to its minimum and maximum values across the 
   * dataset. A common approach is to normalize a value x using the formula:
       * Scoring Logic:
       * The formula is constructed as:
       * normalizedPriceA * 0.4: This means that lower price results in a lower score 
       * (because a lower normalized price contributes less to the score, which is desired for a "better deal").
       * normalizedOdometerA * 0.3: Similarly, a lower odometer results in a lower score.
       * -normalizedYearA * 0.3: This part is negative because you want higher years (i.e., newer cars) to 
       * result in a lower score. Since year is positive, subtracting its normalized value ensures that newer 
       * cars get a better score.
       * 
       * Sorting Behavior:
       * The function compares the total score of two cars, scoreA and scoreB, and sorts them in ascending order:
       * If scoreA is less than scoreB, then car A will be placed before car B in the sorted list 
       * (because a lower score is considered a better deal).
       * Since the formula is designed so that a lower price, lower odometer, and higher year result in a lower 
       * score, the car that best meets your criteria (lowest price, lowest odometer, highest year) will appear 
       * first.
   */
  // Define a function that scores the cars based on normalized price, odometer, and year
  function best_deal(cars) {
    // Helper function to strip non-numeric characters from price and convert to integer
    const parsePrice = (price) => parseInt(price.replace(/[^0-9]/g, ''), 10);
  
    // Find the min and max for each attribute
    const priceMin = Math.min(...cars.map(car => parsePrice(car.price)));
    const priceMax = Math.max(...cars.map(car => parsePrice(car.price)));
    
    const odometerMin = Math.min(...cars.map(car => parseInt(car.odometer, 10)));
    const odometerMax = Math.max(...cars.map(car => parseInt(car.odometer, 10)));
    
    const yearMin = Math.min(...cars.map(car => parseInt(car.year, 10)));
    const yearMax = Math.max(...cars.map(car => parseInt(car.year, 10)));
  
    // Normalize the values and apply the score
    return cars.sort((a, b) => {
      const normalizedPriceA = (parsePrice(a.price) - priceMin) / (priceMax - priceMin || 1); // Prevent division by zero
      const normalizedOdometerA = (parseInt(a.odometer, 10) - odometerMin) / (odometerMax - odometerMin || 1);
      const normalizedYearA = (parseInt(a.year, 10) - yearMin) / (yearMax - yearMin || 1);
  
      const normalizedPriceB = (parsePrice(b.price) - priceMin) / (priceMax - priceMin || 1);
      const normalizedOdometerB = (parseInt(b.odometer, 10) - odometerMin) / (odometerMax - odometerMin || 1);
      const normalizedYearB = (parseInt(b.year, 10) - yearMin) / (yearMax - yearMin || 1);
  
      // Apply the weights to the normalized values
      const scoreA = normalizedPriceA * 0.3 + normalizedOdometerA * 0.4 - normalizedYearA * 0.3;
      const scoreB = normalizedPriceB * 0.3 + normalizedOdometerB * 0.4 - normalizedYearB * 0.3;
  
      // Debugging output to compare the scores
      // console.log(`Car A: Price=${a.price}, Odometer=${a.odometer}, Year=${a.year}, Score=${scoreA}`);
      // console.log(`Car B: Price=${b.price}, Odometer=${b.odometer}, Year=${b.year}, Score=${scoreB}`);
  
      return scoreA - scoreB;  // Sort in ascending order (best deal first)
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
            <p>Welcome to CarSaleSignal; where I try to give small dealerships and individual buyers an unfair information advantage over big players like KBB and Penske.</p>
          </div>

          {/* What is it */}
          <h2
            className="collapsible-title"
            onClick={() => toggleSection("Whatisit")}
          >
            <span
              className={`carrot ${
                expandedSections.Whatisit ? "expanded" : ""
              }`}
            ></span>{" "}
            What is it
          </h2>
          {expandedSections.Whatisit && (
            <div className="collapsible-content">
              <p>
                CarSaleSignal is a database of all the used car listings in America that get taken down and marked as sold by the author of the listing.  This allows small dealerships and private sellers to see what they can sell their car for based on what similar cars are actually being purchased for by private parties--not what KBB or large corporate dealerships claim.
              </p>
            </div>
          )}

          {/* How does it work */}
          <h2
            className="collapsible-title"
            onClick={() => toggleSection("Howdoesitwork")}
          >
            <span
              className={`carrot ${
                expandedSections.Howdoesitwork ? "expanded" : ""
              }`}
            ></span>{" "}
            How does it work
          </h2>
          {expandedSections.Howdoesitwork && (
            <div className="collapsible-content">
              <p>
                CarSaleSignal works from a distributed system of computers in the cloud that collectively read all of Craigslist every night.  Imagine a hundred laptops doing this in your closet:
              </p>
              {/* Embed the GIF */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src={`${process.env.PUBLIC_URL}/ezgif.com-gif-maker.gif`}
                  alt="Description of the gif"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
              <p>
                All day, all night, without stopping, and importantly without interfering with Craigslist's normal operation.  It's not entirely different than mining bitcoin, but instead of doing abstract math what these computers are doing is checking used car listings to see which get flagged as scams, which stay up forever, and which get taken down by the author and marked as sold.  By saving the listing details and the length of time it was up, CarSaleSignal builds a database of every car that sells--and the prices they sell at.
              </p>
            </div>
          )}

          {/* Why bother? */}
          <h2
            className="collapsible-title"
            onClick={() => toggleSection("Whybother")}
          >
            <span
              className={`carrot ${
                expandedSections.Whybother ? "expanded" : ""
              }`}
            ></span>{" "}
            Why bother?
          </h2>
          {expandedSections.Whybother && (
            <div className="collapsible-content">
              <p>
                Because trying to figure out whether or not something is a good deal is fucking frusturating!  Trade-in values all suck, and nobody trusts KBB--with good reason!  We all took 6th grade math; if you don't show your work you don't get credit.  I hate looking at an individual number without getting to see how it got there, and now I don't have to--and neither does anybody else.
              </p>
            </div>
          )}

          {/* Can I try it? */}
          <h2
            className="collapsible-title"
            onClick={() => toggleSection("CanItryit")}
          >
            <span
              className={`carrot ${
                expandedSections.CanItryit ? "expanded" : ""
              }`}
            ></span>{" "}
            Can I try it?
          </h2>
          {expandedSections.CanItryit && (
            <div className="collapsible-content">
              <p>
                Sure, fill out the form and I'll show you all the matching cars that sold in September 2014 in a neat little table--along with some fun graphs of the Prive vs Odometer vs how long the listing was up before selling.
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
                <p>Here are graphs of the cars above, which have already sold.</p>
                <p>By "Days Listed", we mean how long the listing was up before the car sold and the seller removed the listing.</p>
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
            </div>
          )}

          {/* Can I buy it? */}
          <h2
            className="collapsible-title"
            onClick={() => toggleSection("CanIbuyit")}
          >
            <span
              className={`carrot ${
                expandedSections.CanIbuyit ? "expanded" : ""
              }`}
            ></span>{" "}
            Can I buy it?
          </h2>
          {expandedSections.CanIbuyit && (
            <div className="collapsible-content">
              <p>
                Sure can.  Send me an email at cadocary@gmail.com, and for less than you expect I'll hook you up.  Whether you're a private seller who just wants to price their car, or a business that wants live updates of all the sales in their area, we'll work something out.
              </p>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
