Yes, adding an Express.js backend is a good approach to handle SQL requests securely and ensure they are not visible to the browser. Here's a step-by-step guide to set up an Express.js server and integrate it with your React app for sending SQL queries to an RDS database.

### 1. Set up Express.js Backend

You can create an Express.js server that handles the API requests from your React frontend and interacts with the RDS database. This backend will process the SQL queries securely.

#### Create the Express.js Server

1. **Install Express and necessary dependencies**:
   Inside your project directory, run:
   ```bash
   npm init -y
   npm install express body-parser pg
   ```

2. **Create `server.js`**:  
   Create a file `server.js` to handle the backend logic and connect to your RDS PostgreSQL database:

   ```javascript
   const express = require('express');
   const bodyParser = require('body-parser');
   const { Pool } = require('pg');
   
   const app = express();
   const port = 5000;

   // Set up the PostgreSQL connection pool
   const pool = new Pool({
     user: 'your-username', // Update with your RDS username
     host: 'your-rds-endpoint', // RDS endpoint
     database: 'your-database-name', // Database name
     password: 'your-password', // Database password
     port: 5432, // Default PostgreSQL port
   });

   app.use(bodyParser.json());

   // Route to handle SQL SELECT queries
   app.post('/api/cars', async (req, res) => {
     const { make, model, area } = req.body;

     try {
       const query = `
         SELECT * FROM cars_table
         WHERE make = $1 AND model = $2 AND area = $3
       `;
       const values = [make, model, area];
       const result = await pool.query(query, values);

       res.status(200).json(result.rows);
     } catch (error) {
       console.error('Error executing query', error);
       res.status(500).send('Server error');
     }
   });

   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
   ```

   Replace the database connection details (`user`, `host`, `database`, `password`) with your actual RDS information.

#### Run the Express Server

To run the server:
```bash
node server.js
```

This starts the backend server on `localhost:5000`.

### 2. Modify React to Send the Request

In your `App.js`, you'll need to send the dropdown values to your Express backend via a `POST` request. You can use `fetch` or Axios for this.

#### Update `App.js`:

```javascript
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import carData from './public/makemodel.json'; // Assuming JSON is stored locally

function App() {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [result, setResult] = useState(null); // To store the result from the database

  const areas = [
    "auburn", "bham", "dothan", "shoals", "gadsden", "huntsville", "mobile", "montgomery", "tuscaloosa",
    "anchorage", "fairbanks", "kenai", "juneau", "flagstaff", "mohave", "phoenix", "prescott", "showlow",
    // Add more areas as needed...
  ];

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
    setSelectedModel(''); // Reset model when make changes
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        make: selectedMake,
        model: selectedModel,
        area: selectedArea,
      }),
    });

    const data = await response.json();
    setResult(data); // Save the returned data in state
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>

        {/* Enhanced Dropdown Form */}
        <form onSubmit={handleSubmit} className="dropdown-form">
          {/* Area Dropdown */}
          <label htmlFor="areaDropdown" className="dropdown-label">Choose an area:</label>
          <select id="areaDropdown" value={selectedArea} onChange={handleAreaChange} className="dropdown">
            <option value="">-- Select an area --</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Make Dropdown */}
          <label htmlFor="makeDropdown" className="dropdown-label">Select Make:</label>
          <select id="makeDropdown" value={selectedMake} onChange={handleMakeChange} className="dropdown">
            <option value="">-- Choose Make --</option>
            {Object.keys(carData).map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          {/* Model Dropdown (conditionally rendered) */}
          {selectedMake && (
            <>
              <label htmlFor="modelDropdown" className="dropdown-label">Select Model:</label>
              <select id="modelDropdown" value={selectedModel} onChange={handleModelChange} className="dropdown">
                <option value="">-- Choose Model --</option>
                {carData[selectedMake].map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit" className="submit-button">Submit</button>
        </form>

        {/* Display the result */}
        {result && (
          <div className="result">
            <h3>Results:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
```

### 3. CORS Configuration (Optional)

If your React app is running on a different port (e.g., `3000`), you'll need to allow CORS in your Express server. Add the following to your `server.js`:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000' // Update with your React app's URL
}));
```

You can install CORS using:
```bash
npm install cors
```

### 4. Connecting to RDS Securely

Ensure that your Express server can securely connect to your RDS instance using appropriate credentials, which should be managed carefully (e.g., using environment variables instead of hardcoding sensitive information like passwords).

### 5. Running the Application

1. **Start the Express server**:
   ```bash
   node server.js
   ```

2. **Start your React app**:
   In another terminal, navigate to your React project and run:
   ```bash
   npm start
   ```

Now, the dropdown values are securely sent to the backend, where the SQL query is executed, and the results are sent back to the frontend without exposing the SQL request to the browser.

### Final Thoughts:
- This approach prevents exposing SQL requests directly to the browser, protecting your database from direct access.
- You can further enhance security by validating inputs on the backend and ensuring SQL queries are sanitized to prevent SQL injection.