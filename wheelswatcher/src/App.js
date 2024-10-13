import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import carData from './makemodel.json'; // Assuming JSON is stored locally
import axios from 'axios'; // query the backend
import { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph } from './2dGraphs';
import PriceOdometerTime3DGraph from './PriceOdometerTime3DGraph';


// Example data structure of states and areas
const statesAndAreas = {
  Alabama: ["auburn", "birmingham", "dothan", "shoals", "gadsden", "huntsville", "mobile", "montgomery", "tuscaloosa"],
  Alaska: ["anchorage", "fairbanks", "kenai", "juneau"],
  Arizona: ["flagstaff", "mohave", "phoenix", "prescott", "showlow", "sierravista", "tucson", "yuma"],
  Arkansas: ["fayar", "fortsmith", "jonesboro", "littlerock", "texarkana"],
  California: [
    "bakersfield", "chico", "fresno", "goldcountry", "hanford", "humboldt", "imperial", "inlandempire",
    "losangeles", "mendocino", "merced", "modesto", "monterey", "orangecounty", "palmsprings", "redding",
    "sacramento", "sandiego", "sfbay", "slo", "santabarbara", "santamaria", "siskiyou", "stockton", "susanville",
    "ventura", "visalia", "yubasutter"
  ],
  Colorado: ["boulder", "cosprings", "denver", "eastco", "fortcollins", "rockies", "pueblo", "westslope"],
  Connecticut: ["newlondon", "hartford", "newhaven", "nwct"],
  Delaware: ["delaware"],
  DistrictOfColumbia: ["washingtondc"],
  Florida: [
    "broward", "daytona", "keys", "miami", "fortmyers", "gainesville", "cfl", "jacksonville", "lakeland",
    "lakecity", "ocala", "okaloosa", "orlando", "panamacity", "pensacola", "sarasota", "spacecoast", "staugustine",
    "tallahassee", "tampa", "treasure"
  ],
  Georgia: ["albanyga", "athensga", "atlanta", "augusta", "brunswick", "columbusga", "macon", "nwga", "savannah", "statesboro", "valdosta"],
  Hawaii: ["honolulu"],
  Idaho: ["boise", "eastidaho", "lewiston", "twinfalls"],
  Illinois: [
    "bn", "chambana", "chicago", "decatur", "lasalle", "mattoon", "peoria", "rockford", "carbondale",
    "springfieldil", "quincy"
  ],
  Indiana: ["bloomington", "evansville", "fortwayne", "indianapolis", "kokomo", "tippecanoe", "muncie", "richmondin", "southbend", "terrehaute"],
  Iowa: [
    "ames", "cedarrapids", "desmoines", "dubuque", "fortdodge", "iowacity", "masoncity", "quadcities",
    "siouxcity", "ottumwa", "waterloo"
  ],
  Kansas: ["lawrence", "ksu", "nwks", "salina", "seks", "swks", "topeka", "wichita"],
  Kentucky: ["bgky", "eastky", "lexington", "louisville", "owensboro", "westky"],
  Louisiana: ["batonrouge", "cenla", "houma", "lafayette", "lakecharles", "monroe", "neworleans", "shreveport"],
  Maine: ["maine"],
  Maryland: ["annapolis", "baltimore", "easternshore", "frederick", "smd", "westmd"],
  Massachusetts: ["boston", "capecod", "southcoast", "westernmass", "worcester"],
  Michigan: [
    "annarbor", "battlecreek", "centralmich", "detroit", "flint", "grandrapids", "holland", "jxn",
    "kalamazoo", "lansing", "monroemi", "muskegon", "nmi", "porthuron", "saginaw", "swmi", "thumb", "up"
  ],
  Minnesota: ["bemidji", "brainerd", "duluth", "mankato", "minneapolis", "rmn", "marshall", "stcloud"],
  Mississippi: ["gulfport", "hattiesburg", "jackson", "meridian", "northmiss", "natchez"],
  Missouri: ["columbiamo", "joplin", "kansascity", "kirksville", "loz", "semo", "springfield", "stjoseph", "stlouis"],
  Montana: ["billings", "bozeman", "butte", "greatfalls", "helena", "kalispell", "missoula", "montana"],
  Nebraska: ["grandisland", "lincoln", "northplatte", "omaha", "scottsbluff"],
  Nevada: ["elko", "lasvegas", "reno"],
  NewHampshire: ["nh"],
  NewJersey: ["cnj", "jerseyshore", "newjersey", "southjersey"],
  NewMexico: ["albuquerque", "clovis", "farmington", "lascruces", "roswell", "santafe"],
  NewYork: [
    "albany", "binghamton", "buffalo", "catskills", "chautauqua", "elmira", "fingerlakes", "glensfalls",
    "hudsonvalley", "ithaca", "longisland", "newyork", "oneonta", "plattsburgh", "potsdam", "rochester",
    "syracuse", "twintiers", "utica", "watertown"
  ],
  NorthCarolina: [
    "asheville", "boone", "charlotte", "eastnc", "fayetteville", "greensboro", "hickory", "onslow",
    "outerbanks", "raleigh", "wilmington", "winstonsalem"
  ],
  NorthDakota: ["bismarck", "fargo", "grandforks", "nd"],
  Ohio: [
    "akroncanton", "ashtabula", "athensohio", "chillicothe", "cincinnati", "cleveland", "columbus", "dayton",
    "limaohio", "mansfield", "sandusky", "toledo", "tuscarawas", "youngstown", "zanesville"
  ],
  Oklahoma: ["lawton", "enid", "oklahomacity", "stillwater", "tulsa"],
  Oregon: ["bend", "corvallis", "eastoregon", "eugene", "klamath", "medford", "oregoncoast", "portland", "roseburg", "salem"],
  Pennsylvania: [
    "altoona", "chambersburg", "erie", "harrisburg", "lancaster", "allentown", "meadville", "philadelphia",
    "pittsburgh", "poconos", "reading", "scranton", "pennstate", "williamsport", "york"
  ],
  RhodeIsland: ["providence"],
  SouthCarolina: ["charleston", "columbia", "florencesc", "greenville", "hiltonhead", "myrtlebeach"],
  SouthDakota: ["nesd", "csd", "rapidcity", "siouxfalls", "sd"],
  Tennessee: ["chattanooga", "clarksville", "cookeville", "jacksontn", "knoxville", "memphis", "nashville", "tricities"],
  Texas: [
    "abilene", "amarillo", "austin", "beaumont", "brownsville", "collegestation", "corpuschristi", "dallas",
    "nacogdoches", "delrio", "elpaso", "galveston", "houston", "killeen", "laredo", "lubbock", "mcallen",
    "odessa", "sanangelo", "sanantonio", "sanmarcos", "bigbend", "texoma", "easttexas", "victoriatx", "waco", "wichitafalls"
  ],
  Utah: ["logan", "ogden", "provo", "saltlakecity", "stgeorge"],
  Vermont: ["vermont"],
  Virginia: [
    "charlottesville", "danville", "fredericksburg", "norfolk", "harrisonburg", "lynchburg", "blacksburg",
    "richmond", "roanoke", "swva", "winchester"
  ],
  Washington: [
    "bellingham", "kpr", "moseslake", "olympic", "pullman", "seattle", "skagit", "spokane",
    "wenatchee", "yakima"
  ],
  WestVirginia: ["charlestonwv", "martinsburg", "huntington", "morgantown", "wheeling", "parkersburg", "swv", "wv"],
  Wisconsin: [
    "appleton", "eauclaire", "greenbay", "janesville", "racine", "lacrosse", "madison", "milwaukee",
    "northernwi", "sheboygan", "wausau"
  ],
  Wyoming: ["wyoming"],
  Territories: ["micronesia", "puertorico", "virgin"]
};



function App() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  // const [selectedMake, setSelectedMake] = useState('');
  // const [selectedModel, setSelectedModel] = useState('');
  const [results, setResults] = useState([]); // To store the query results of sold cars
  const [unsoldCars, setUnsoldCars] = useState([]);  // To store the unsold Subaru cars


  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedArea(''); // Reset area when state changes
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };


  // Call the endpoint for unsold cars after submit
  const fetchUnsoldCars = async () => {
    try {
      const response = await axios.post('https://carsalesignal.com/api/unsold-dreams', {
        area: selectedArea
      });
      console.log('Unsold Query Result:', response.data);
      setUnsoldCars(best_deal(response.data));  // Sort by best_deal
    } catch (error) {
      console.error('Error fetching unsold cars:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert(`Selected Area: ${selectedArea}, Make: ${selectedMake}, Model: ${selectedModel}`);

    try {
      const response = await axios.post('https://carsalesignal.com/api/sold-dreams', {
        area: selectedArea
      });

      console.log('Sold Query Result:', response.data);
      setResults(response.data); // Set the response data into state
      // get the unsold cars
      fetchUnsoldCars();
    } catch (error) {
      console.error('Error querying the database:', error);
    }
  };

  // Define a function that scores the cars based on price, odometer, and year
  function best_deal(cars) {
    return cars.sort((a, b) => {
      // Example scoring formula: prioritize low price, low odometer, and high year
      const scoreA = a.price * 0.4 + a.odometer * 0.3 - a.year * 0.3;
      const scoreB = b.price * 0.4 + b.odometer * 0.3 - b.year * 0.3;
      return scoreA - scoreB;  // Sort in ascending order (best deal first)
    });
  }


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Select a state and area to see the car listings and their price vs duration graph.</p>
        <a className="App-link" href="mailto:cadocary@gmail.com" target="_blank" rel="noopener noreferrer">
          Contact
        </a>

        {/* Compound Dropdown Form */}
        <form onSubmit={handleSubmit} className="dropdown-form">

          {/* State Dropdown */}
          <label htmlFor="stateDropdown" className="dropdown-label">Choose a state:</label>
          <select id="stateDropdown" value={selectedState} onChange={handleStateChange} className="dropdown">
            <option value="">-- Select a state --</option>
            {Object.keys(statesAndAreas).map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* Area Dropdown (only shown when a state is selected) */}
          {selectedState && (
            <>
              <label htmlFor="areaDropdown" className="dropdown-label">Choose an area:</label>
              <select id="areaDropdown" value={selectedArea} onChange={handleAreaChange} className="dropdown">
                <option value="">-- Select an area --</option>
                {statesAndAreas[selectedState].map((area, index) => (
                  <option key={index} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit" className="submit-button" disabled={!selectedArea}>Submit</button>
        </form>


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
            <h2>Cars Sold in the past, the Input Data to the Graphs</h2> {/* Add title here */}
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


// Use the fetchUnsoldCars function appropriately in your flow, for example after form submission

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
                        <i className="fas fa-link"></i>  {/* Font Awesome or custom icon */}
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
