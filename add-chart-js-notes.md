Here’s a complete implementation of `PriceDurationGraph.js` using **Chart.js** and **React**. I’ll also show you how to integrate this new component into `App.js`.

### Step 1: Install `react-chartjs-2` and `chart.js`
First, you need to install the necessary dependencies:
```bash
npm install react-chartjs-2 chart.js
```

### Step 2: Create `PriceDurationGraph.js`

```javascript
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components needed for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceDurationGraph = ({ listings }) => {
  // Extract data for the graph (price and duration)
  const chartData = listings.map(listing => ({
    title: listing.title,
    price: parseFloat(listing.price.replace(/[$,]/g, '')), // Parse the price string to a number
    duration: Math.abs(new Date(listing.updated) - new Date(listing.added)) / (1000 * 3600 * 24) // Convert duration to days
  }));

  // Prepare the data for the Chart.js line chart
  const data = {
    labels: chartData.map(item => item.title), // Use listing titles as labels
    datasets: [
      {
        label: 'Price ($)',
        data: chartData.map(item => item.price),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Duration (Days)',
        data: chartData.map(item => item.duration),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price vs Duration (Days) of Listings',
      },
    },
  };

  return (
    <div className="graph-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceDurationGraph;
```

### Step 3: Update `App.js` to integrate `PriceDurationGraph`

Here’s how you can update `App.js` to include `PriceDurationGraph` and display the chart after fetching the data:

```javascript
import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import PriceDurationGraph from './PriceDurationGraph'; // Import the new component

function App() {
  const [selectedArea, setSelectedArea] = useState('');
  const [listings, setListings] = useState([]); // State to store listings data

  const areas = [
    "auburn", "bham", "dothan", "shoals", "gadsden", "huntsville", "mobile", "montgomery", "tuscaloosa",
    "anchorage", "fairbanks", "kenai", "juneau", "flagstaff", "mohave", "phoenix", "prescott", "showlow",
  ];

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert(`Selected Area: ${selectedArea}`);
  
    try {
      const response = await axios.post('https://carsalesignal.com/api/query-area', {
        area: selectedArea,
      });
  
      setListings(response.data); // Store the fetched listings data
    } catch (error) {
      console.error('Error querying the database:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Select an area to see the car listings and their price vs duration graph.</p>
        <a className="App-link" href="mailto:cadocary@gmail.com" target="_blank" rel="noopener noreferrer">
          Contact
        </a>

        {/* Dropdown Form */}
        <form onSubmit={handleSubmit} className="dropdown-form">
          <label htmlFor="areaDropdown" className="dropdown-label">Choose an area:</label>
          <select id="areaDropdown" value={selectedArea} onChange={handleAreaChange} className="dropdown">
            <option value="">-- Select an area --</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button type="submit" className="submit-button">Submit</button>
        </form>

        {/* Render the PriceDurationGraph component only if listings data is available */}
        {listings.length > 0 && (
          <div className="graph-section">
            <PriceDurationGraph listings={listings} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
```

### Step 4: Update `App.css` (Optional)

You can adjust the styling for the graph container in your `App.css` file:

```css
/* Styles for the graph container */
.graph-container {
  margin: 20px auto;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  background-color: rgba(255, 255, 255, 0.1); /* Match form background */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.graph-section {
  margin-top: 20px;
  width: 100%;
}
```

### What This Does:
- `PriceDurationGraph.js` fetches the listings, extracts the price and duration for each listing, and uses **Chart.js** to render a line chart.
- The `App.js` component integrates the graph by rendering `PriceDurationGraph` once listings data is fetched after selecting an area.
- The chart displays two datasets: one for **price** and one for **duration** in days.

With this setup, the graph will update dynamically based on the listings returned from your API!
