const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
// Configure CORS to allow only the specific domain
app.use(cors({
    origin: 'https://carsalesignal.com',  // Allow only your frontend domain
    methods: ['GET', 'POST'],             // Allow GET and POST requests
    allowedHeaders: ['Content-Type'],     // Allow specific headers
    credentials: true                     // If you need to allow cookies
  }));

  
// PostgreSQL connection pool (adjust credentials to your RDS instance)
const pool = new Pool({
  user: 'postgres',
  host: 'database-1.cluster-ro-cvu2u86aui5t.us-west-2.rds.amazonaws.com',
  database: 'seattlecars',
  password: 'kellybluebook',
  port: 5432,  // Or your RDS port
});


// Endpoint to run a SELECT query based on dropdown inputs
app.post('/api/query-listings', async (req, res) => {
  const { area, make, model } = req.body;

  try {
    const query = `
      SELECT * FROM listings
      WHERE area = $1 AND make = $2 AND model = $3
      LIMIT 10;
    `;
    const values = [area, make, model];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


// Endpoint to run a SELECT query for unsold dream subarus
app.post('/api/unsold-dreams', async (req, res) => {
  const { area } = req.body;

  try {
    const query = `
      SELECT title, price, year, odometer, url 
      FROM listings 
      WHERE make = 'subaru' 
        AND model = 'outback'
        AND (posting_body ILIKE '%6cyl%' OR 
            posting_body ILIKE '%6 cyl%' OR 
            posting_body ILIKE '%6cylinder%' OR 
            posting_body ILIKE '%6 cylinder%' OR 
            cylinders = '6 cylinders')
        AND CAST(year AS INTEGER) BETWEEN 2001 AND 2010
        AND updated = 'not updated yet'
        AND area IN ('bellingham', 'kpr', 'moseslake', 'olympic', 'pullman', 'seattle', 'skagit', 'spokane', 'wenatchee', 'yakima')
      LIMIT 100;
    `;

    //const values = [area];

    const result = await pool.query(query) // No need for 'values' array. , values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Endpoint to run a SELECT query based on the dream subaru
app.post('/api/sold-dreams', async (req, res) => {
    const { area } = req.body;
  
    try {
      const query = `
        SELECT title, price, year, odometer, added, updated 
        FROM listings 
        WHERE make = 'subaru' 
          AND model = 'outback'
          AND (posting_body ILIKE '%6cyl%' OR 
              posting_body ILIKE '%6 cyl%' OR 
              posting_body ILIKE '%6cylinder%' OR 
              posting_body ILIKE '%6 cylinder%' OR 
              cylinders = '6 cylinders')
          AND CAST(year AS INTEGER) BETWEEN 2001 AND 2010
          AND updated != 'not updated yet' 
        LIMIT 100;
        `;

      //const values = [area];
  
      const result = await pool.query(query) // No need for 'values' array. , values);
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });


// Add this route to handle the health check
app.get('/api/health-check', (req, res) => {
    res.status(200).send('API is healthy');
  });
  

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
