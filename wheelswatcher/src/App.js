import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [selectedValue, setSelectedValue] = useState('');

  const areas = [
    "auburn", "bham", "dothan", "shoals", "gadsden", "huntsville", "mobile", "montgomery", "tuscaloosa",
    "anchorage", "fairbanks", "kenai", "juneau", "flagstaff", "mohave", "phoenix", "prescott", "showlow",
    "sierravista", "tucson", "yuma", "fayar", "fortsmith", "jonesboro", "littlerock", "texarkana",
    "bakersfield", "chico", "fresno", "goldcountry", "hanford", "humboldt", "imperial", "inlandempire",
    "losangeles", "mendocino", "merced", "modesto", "monterey", "orangecounty", "palmsprings", "redding",
    "sacramento", "sandiego", "sfbay", "slo", "santabarbara", "santamaria", "siskiyou", "stockton",
    "susanville", "ventura", "visalia", "yubasutter", "boulder", "cosprings", "denver", "eastco",
    "fortcollins", "rockies", "pueblo", "westslope", "newlondon", "hartford", "newhaven", "nwct",
    "delaware", "washingtondc", "miami", "daytona", "keys", "miami", "fortmyers", "gainesville", "cfl",
    "jacksonville", "lakeland", "miami", "lakecity", "ocala", "okaloosa", "orlando", "panamacity",
    "pensacola", "sarasota", "miami", "spacecoast", "staugustine", "tallahassee", "tampa", "treasure",
    "miami", "albanyga", "athensga", "atlanta", "augusta", "brunswick", "columbusga", "macon", "nwga",
    "savannah", "statesboro", "valdosta", "honolulu", "boise", "eastidaho", "lewiston", "twinfalls",
    "bn", "chambana", "chicago", "decatur", "lasalle", "mattoon", "peoria", "rockford", "carbondale",
    "springfieldil", "quincy", "bloomington", "evansville", "fortwayne", "indianapolis", "kokomo",
    "tippecanoe", "muncie", "richmondin", "southbend", "terrehaute", "ames", "cedarrapids", "desmoines",
    "dubuque", "fortdodge", "iowacity", "masoncity", "quadcities", "siouxcity", "ottumwa", "waterloo",
    "lawrence", "ksu", "nwks", "salina", "seks", "swks", "topeka", "wichita", "bgky", "eastky",
    "lexington", "louisville", "owensboro", "westky", "batonrouge", "cenla", "houma", "lafayette",
    "lakecharles", "monroe", "neworleans", "shreveport", "maine", "annapolis", "baltimore", "easternshore",
    "frederick", "smd", "westmd", "boston", "capecod", "southcoast", "westernmass", "worcester",
    "annarbor", "battlecreek", "centralmich", "detroit", "flint", "grandrapids", "holland", "jxn",
    "kalamazoo", "lansing", "monroemi", "muskegon", "nmi", "porthuron", "saginaw", "swmi", "thumb", "up",
    "bemidji", "brainerd", "duluth", "mankato", "minneapolis", "rmn", "marshall", "stcloud", "gulfport",
    "hattiesburg", "jackson", "meridian", "northmiss", "natchez", "columbiamo", "joplin", "kansascity",
    "kirksville", "loz", "semo", "springfield", "stjoseph", "stlouis", "billings", "bozeman", "butte",
    "greatfalls", "helena", "kalispell", "missoula", "montana", "grandisland", "lincoln", "northplatte",
    "omaha", "scottsbluff", "elko", "lasvegas", "reno", "nh", "cnj", "jerseyshore", "newjersey",
    "southjersey", "albuquerque", "clovis", "farmington", "lascruces", "roswell", "santafe", "albany",
    "binghamton", "buffalo", "catskills", "chautauqua", "elmira", "fingerlakes", "glensfalls",
    "hudsonvalley", "ithaca", "longisland", "newyork", "oneonta", "plattsburgh", "potsdam", "rochester",
    "syracuse", "twintiers", "utica", "watertown", "asheville", "boone", "charlotte", "eastnc",
    "fayetteville", "greensboro", "hickory", "onslow", "outerbanks", "raleigh", "wilmington",
    "winstonsalem", "bismarck", "fargo", "grandforks", "nd", "akroncanton", "ashtabula", "athensohio",
    "chillicothe", "cincinnati", "cleveland", "columbus", "dayton", "limaohio", "mansfield", "sandusky",
    "toledo", "tuscarawas", "youngstown", "zanesville", "lawton", "enid", "oklahomacity", "stillwater",
    "tulsa", "bend", "corvallis", "eastoregon", "eugene", "klamath", "medford", "oregoncoast", "portland",
    "roseburg", "salem", "altoona", "chambersburg", "erie", "harrisburg", "lancaster", "allentown",
    "meadville", "philadelphia", "pittsburgh", "poconos", "reading", "scranton", "pennstate",
    "williamsport", "york", "providence", "charleston", "columbia", "florencesc", "greenville",
    "hiltonhead", "myrtlebeach", "nesd", "csd", "rapidcity", "siouxfalls", "sd", "chattanooga",
    "clarksville", "cookeville", "jacksontn", "knoxville", "memphis", "nashville", "tricities",
    "abilene", "amarillo", "austin", "beaumont", "brownsville", "collegestation", "corpuschristi",
    "dallas", "nacogdoches", "delrio", "elpaso", "galveston", "houston", "killeen", "laredo",
    "lubbock", "mcallen", "odessa", "sanangelo", "sanantonio", "sanmarcos", "bigbend", "texoma",
    "easttexas", "victoriatx", "waco", "wichitafalls", "logan", "ogden", "provo", "saltlakecity",
    "stgeorge", "vermont", "charlottesville", "danville", "fredericksburg", "norfolk", "harrisonburg",
    "lynchburg", "blacksburg", "richmond", "roanoke", "swva", "winchester", "bellingham", "kpr",
    "moseslake", "olympic", "pullman", "seattle", "skagit", "spokane", "wenatchee", "yakima",
    "charlestonwv", "martinsburg", "huntington", "morgantown", "wheeling", "parkersburg", "swv", "wv",
    "appleton", "eauclaire", "greenbay", "janesville", "racine", "lacrosse", "madison", "milwaukee",
    "northernwi", "sheboygan", "wausau", "wyoming", "micronesia", "puertorico", "virgin"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected area: ${selectedValue}`);
  };

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* Dropdown form starts here */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="dropdown">Choose an area:</label>
          <select id="dropdown" value={selectedValue} onChange={handleChange}>
            <option value="">-- Select an area --</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button type="submit">Submit</button>
        </form>
        {/* Dropdown form ends here */}
      </header>
    </div>
  );
}

export default App;
