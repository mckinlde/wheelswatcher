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
  const [results, setResults] = useState(
    [
      {
        "added": "2024-10-02T07:45:59.740147",
        "odometer": "not found",
        "price": "$6,150",
        "title": "2001 ford f150",
        "updated": "2024-10-23T07:54:04.776716",
        "year": "2001"
      },
      {
        "added": "2024-11-02T15:41:03.776040",
        "odometer": "2,007,742",
        "price": "$2,700",
        "title": "2007 ford f150 pickup",
        "updated": "2024-11-03T19:36:34.714686",
        "year": "2007"
      },
      {
        "added": "2024-10-04T10:22:59.142083",
        "odometer": "147,000",
        "price": "$3,500",
        "title": "awesome ford f150 work truck!",
        "updated": "2024-10-06T08:05:47.391666",
        "year": "2001"
      },
      {
        "added": "2024-10-04T17:52:16.267909",
        "odometer": "445,000",
        "price": "$4,000",
        "title": "2007 ford f150 xlt 4x4",
        "updated": "2024-10-20T19:10:56.485930",
        "year": "2007"
      },
      {
        "added": "2024-10-04T10:42:52.331657",
        "odometer": "196,000",
        "price": "$6,000",
        "title": "2001 ford f150",
        "updated": "2024-11-05T05:58:27.272293",
        "year": "2001"
      },
      {
        "added": "2024-10-04T10:59:02.978420",
        "odometer": "231,000",
        "price": "$4,500",
        "title": "2002 ford f150 $4500",
        "updated": "2024-10-19T16:28:17.873355",
        "year": "2002"
      },
      {
        "added": "2024-10-04T22:13:45.037394",
        "odometer": "130,000",
        "price": "$3,500",
        "title": "2008 ford f150 xl",
        "updated": "2024-10-06T04:52:25.338474",
        "year": "2008"
      },
      {
        "added": "2024-10-04T20:07:52.531230",
        "odometer": "123,446",
        "price": "$7,500",
        "title": "2003 f150 ext cab",
        "updated": "2024-10-31T10:41:39.165877",
        "year": "2003"
      },
      {
        "added": "2024-10-05T22:51:42.649604",
        "odometer": "215,000",
        "price": "$5,000",
        "title": "2008- 2007 ford f150",
        "updated": "2024-11-05T14:24:36.953061",
        "year": "2008"
      },
      {
        "added": "2024-10-04T17:44:45.630494",
        "odometer": "260,000",
        "price": "$4,600",
        "title": "2005 ford f150",
        "updated": "2024-11-02T15:47:57.327360",
        "year": "2005"
      },
      {
        "added": "2024-10-03T22:08:21.953706",
        "odometer": "240,000",
        "price": "$9,500",
        "title": "2010 ford f150",
        "updated": "2024-10-06T04:35:52.948510",
        "year": "2010"
      },
      {
        "added": "2024-10-04T18:28:31.041553",
        "odometer": "220,000",
        "price": "$3,000",
        "title": "2002 f150 triton v8 4x4",
        "updated": "2024-10-06T07:05:56.277087",
        "year": "2002"
      },
      {
        "added": "2024-10-05T23:05:46.718256",
        "odometer": "189,000",
        "price": "$3,800",
        "title": "for sale ford f 150 3800 obo",
        "updated": "2024-11-05T14:20:57.577482",
        "year": "2001"
      },
      {
        "added": "2024-10-07T08:03:24.673368",
        "odometer": "200,000",
        "price": "$3,999",
        "title": "ford f-150 4wd supercab pickup truck /suv all opt org owner new tires",
        "updated": "2024-11-05T05:52:30.415412",
        "year": "2002"
      },
      {
        "added": "2024-10-04T12:39:09.218626",
        "odometer": "160,000",
        "price": "$4,950",
        "title": "2002 ford f150",
        "updated": "2024-10-07T16:31:04.516587",
        "year": "2002"
      },
      {
        "added": "2024-10-04T20:12:47.703914",
        "odometer": "130,000",
        "price": "$7,500",
        "title": "2004 ford f150 4x4 low miles",
        "updated": "2024-10-07T17:41:49.432497",
        "year": "2004"
      },
      {
        "added": "2024-10-12T00:03:54.911118",
        "odometer": "214,000",
        "price": "$2,900",
        "title": "2004 ford f-150 xl v8 long bed with 214k org miles must see! reg",
        "updated": "2024-10-12T23:50:18.214649",
        "year": "2004"
      },
      {
        "added": "2024-10-17T04:19:43.675138",
        "odometer": "234,000",
        "price": "$3,900",
        "title": "2002 f-150 lariat",
        "updated": "2024-10-24T05:24:45.956604",
        "year": "2002"
      },
      {
        "added": "2024-10-04T09:51:19.234051",
        "odometer": "65,718",
        "price": "$10,500",
        "title": "2006 ford f150 extend cab (65,718 original miles)",
        "updated": "2024-10-20T18:43:19.052268",
        "year": "2006"
      },
      {
        "added": "2024-10-04T17:43:28.267136",
        "odometer": "150,000",
        "price": "$8,900",
        "title": "2003 ford f150 lariat",
        "updated": "2024-10-20T18:56:54.113013",
        "year": "2003"
      },
      {
        "added": "2024-10-04T18:03:34.053588",
        "odometer": "95,838",
        "price": "$7,995",
        "title": "2010 f150 xlt, 5.4l v8",
        "updated": "2024-10-20T19:18:05.116472",
        "year": "2010"
      },
      {
        "added": "2024-10-06T21:50:42.076965",
        "odometer": "264,485",
        "price": "$4,600",
        "title": "2005 ford f150",
        "updated": "2024-11-06T15:30:08.207342",
        "year": "2005"
      },
      {
        "added": "2024-10-20T18:53:27.715264",
        "odometer": "234,000",
        "price": "$3,750",
        "title": "2002 f-150 lariat",
        "updated": "2024-10-24T05:34:09.722528",
        "year": "2002"
      },
      {
        "added": "2024-10-17T07:51:50.017390",
        "odometer": "134,000",
        "price": "$8,500",
        "title": "2010 ford f150 extended 1own 134k runs perfect",
        "updated": "2024-10-24T09:16:05.735194",
        "year": "2010"
      },
      {
        "added": "2024-11-01T09:01:46.300572",
        "odometer": "190,000",
        "price": "$2,650",
        "title": "2007 ford f150 v8 short bed runs good",
        "updated": "2024-11-02T10:35:51.376983",
        "year": "2007"
      },
      {
        "added": "2024-10-24T06:00:54.999964",
        "odometer": "211,000",
        "price": "$3,495",
        "title": "2007 f150 flexfuel",
        "updated": "2024-11-02T16:15:09.994995",
        "year": "2007"
      },
      {
        "added": "2024-10-27T16:08:05.913841",
        "odometer": "294,778",
        "price": "$1,200",
        "title": "2002 f150",
        "updated": "2024-11-03T19:57:29.464807",
        "year": "2002"
      },
      {
        "added": "2024-10-04T18:26:57.968057",
        "odometer": "144,000",
        "price": "$11,000",
        "title": "2008 ford f150 4x4",
        "updated": "2024-10-14T03:24:13.377268",
        "year": "2008"
      },
      {
        "added": "2024-10-07T21:12:28.849393",
        "odometer": "275,000",
        "price": "$3,750",
        "title": "2003 ford f150 crewcab 4x4",
        "updated": "2024-10-22T02:43:16.060554",
        "year": "2003"
      },
      {
        "added": "2024-10-04T12:10:05.734675",
        "odometer": "260,000",
        "price": "$1,500",
        "title": "2010 ford f150",
        "updated": "2024-10-06T11:54:09.646403",
        "year": "2010"
      },
      {
        "added": "2024-10-04T19:57:19.208485",
        "odometer": "190,000",
        "price": "$4,000",
        "title": "2004 ford f150 triton",
        "updated": "2024-10-18T10:02:39.201818",
        "year": "2004"
      },
      {
        "added": "2024-10-04T20:03:20.245406",
        "odometer": "180,000",
        "price": "$2,500",
        "title": "2005 black ford f150 crewcab",
        "updated": "2024-10-06T09:47:51.035040",
        "year": "2005"
      },
      {
        "added": "2024-10-04T20:07:42.494381",
        "odometer": "123,446",
        "price": "$7,500",
        "title": "2003 f150 ext cab",
        "updated": "2024-10-31T10:41:29.214937",
        "year": "2003"
      },
      {
        "added": "2024-10-04T20:12:24.725775",
        "odometer": "62,000",
        "price": "$4,800",
        "title": "ford f150 inspected!",
        "updated": "2024-10-06T11:10:29.915832",
        "year": "2010"
      },
      {
        "added": "2024-10-04T17:36:52.724011",
        "odometer": "146,000",
        "price": "$11,000",
        "title": "2010 ford f150",
        "updated": "2024-10-06T05:30:33.263763",
        "year": "2010"
      },
      {
        "added": "2024-10-04T20:15:21.705270",
        "odometer": "120,000",
        "price": "$2,500",
        "title": "2004 ford f 150,",
        "updated": "2024-10-22T01:46:45.287701",
        "year": "2004"
      },
      {
        "added": "2024-10-04T20:32:07.515648",
        "odometer": "179,000",
        "price": "$5,000",
        "title": "2001 f150, needs transmission repair",
        "updated": "2024-10-06T10:54:43.878450",
        "year": "2001"
      },
      {
        "added": "2024-10-04T17:59:23.834403",
        "odometer": "220,000",
        "price": "$6,000",
        "title": "2009 ford f150 4x4 supercab",
        "updated": "2024-10-06T13:40:12.353032",
        "year": "2009"
      },
      {
        "added": "2024-10-04T18:10:01.049873",
        "odometer": "175,000",
        "price": "$4,500",
        "title": "2008 ford f-150 xlt",
        "updated": "2024-10-20T19:31:23.458888",
        "year": "2008"
      },
      {
        "added": "2024-10-06T02:58:45.032101",
        "odometer": "127,000",
        "price": "$5,500",
        "title": "2006 ford f150 work truck",
        "updated": "2024-11-06T10:49:29.137619",
        "year": "2006"
      }
    ]   
  );
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
      // const response = await axios.post('https://carsalesignal.com/api/sold-parameterized', {
      //   make: lowercasedMake,
      //   model: lowercasedModel,
      //   startYear,
      //   endYear,
      //   bodyTerms: bodyTermsArray
      // });
      // setResults(response.data);
      // console.log(response.data)
      // fetchUnsoldCars(lowercasedMake, lowercasedModel, startYear, endYear, bodyTermsArray);
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
            CarSaleSignal works from a distributed system of computers in the cloud (fancy words because I use this on my resume; it's just this:
          </p>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={`${process.env.PUBLIC_URL}/ezgif.com-gif-maker.gif`}
              alt="Description of the gif"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          </div>
          <p>running on a bunch of copies that I rent from Jeff Bezos.)</p>
          <p>
            Collectively, they read all of Craigslist every night.  When a new listing is posted, it gets saved to the database along with the time it was posted.  When a listing gets removed by the seller, (without expiring or being flagged as a scam), the database gets updated with the time that listing was removed. (We presume these listings sold; and we're very thankful that Craigslist tells us which ones were taken doen by the seller, which ones expired, and which ones were flagged.)
          </p>

          <h2>Why bother?</h2>
          <p>
            Because trying to figure out whether or not something is a good deal is frustrating! 
            Trade-in values all suck, and nobody trusts KBB--with good reason.  We all took 6th grade math, and when you don't show your work you don't get credit.  That's why I built CarSaleSignal--to show you the data, so you can make your own informed decisions.
          </p>

          <h2>Can I try it for free?</h2>
          <p>
            Sure, here's 96 of the 2001-2010 F150's that sold in America during September 2014; keep in mind that by "Days Listed", we mean the length of time between the listing being posted and the listing being removed by the seller.  We exclude listings that say they expired or were flagged.  Use my email at the top if you'd like me to setup live updates for your business!
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
            {/* <button type="submit" className="submit-button">
              Search Cars
            </button> */}
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
          <p>
            cadocary@gmail.com
          </p>
        </header>
      </div>
    </div>
  );
}

export default App;
