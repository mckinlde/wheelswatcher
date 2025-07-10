const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://carsalesignal.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// PostgreSQL connection pool via Tailscale
const pool = new Pool({
  user: 'ec2_writer',
  password: 'somethingsecure',
  host: '100.80.9.95',
  port: 5432,
  database: 'DVc4_data',
});

// API routes
app.post('/api/query-listings', async (req, res) => {
  const { area, make, model } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM listings WHERE area = $1 AND make = $2 AND model = $3 LIMIT 10;`,
      [area, make, model]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/unsold-dreams', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT title, price, year, odometer, url 
      FROM listings 
      WHERE make = 'subaru' AND model = 'outback'
        AND (posting_body ILIKE '%6cyl%' OR 
             posting_body ILIKE '%6 cyl%' OR 
             posting_body ILIKE '%6cylinder%' OR 
             posting_body ILIKE '%6 cylinder%' OR 
             cylinders = '6 cylinders')
        AND CAST(year AS INTEGER) BETWEEN 2001 AND 2010
        AND updated = 'not updated yet'
        AND area IN ('bellingham', 'kpr', 'moseslake', 'olympic', 'pullman', 'seattle', 'skagit', 'spokane', 'wenatchee', 'yakima')
      LIMIT 100;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/sold-dreams', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT title, price, year, odometer, added, updated 
      FROM listings 
      WHERE make = 'subaru' AND model = 'outback'
        AND (posting_body ILIKE '%6cyl%' OR 
             posting_body ILIKE '%6 cyl%' OR 
             posting_body ILIKE '%6cylinder%' OR 
             posting_body ILIKE '%6 cylinder%' OR 
             cylinders = '6 cylinders')
        AND CAST(year AS INTEGER) BETWEEN 2001 AND 2010
        AND updated != 'not updated yet'
      LIMIT 100;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/unsold-parameterized', async (req, res) => {
  const { area, make, model, startYear, endYear, bodyTerms } = req.body;
  try {
    let query = `
      SELECT title, price, year, odometer, url 
      FROM listings 
      WHERE make = $1 AND model = $2
        AND CAST(year AS INTEGER) BETWEEN $3 AND $4
        AND updated = 'not updated yet'
        AND area IN ('bellingham', 'kpr', 'moseslake', 'olympic', 'pullman', 'seattle', 'skagit', 'spokane', 'wenatchee', 'yakima')
    `;
    const queryParams = [make, model, startYear, endYear];
    if (bodyTerms && bodyTerms.length > 0) {
      const bodyConditions = bodyTerms
        .map((_, i) => `posting_body ILIKE $${queryParams.length + i + 1}`)
        .join(' OR ');
      query += ` AND (${bodyConditions})`;
      bodyTerms.forEach(term => queryParams.push(`%${term}%`));
    }
    query += ` LIMIT 100;`;
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/sold-parameterized', async (req, res) => {
  const { area, make, model, startYear, endYear, bodyTerms } = req.body;
  try {
    let query = `
      SELECT title, price, year, odometer, added, updated 
      FROM listings 
      WHERE make = $1 AND model = $2
        AND CAST(year AS INTEGER) BETWEEN $3 AND $4
        AND updated != 'not updated yet'
    `;
    const queryParams = [make, model, startYear, endYear];
    if (bodyTerms && bodyTerms.length > 0) {
      const bodyConditions = bodyTerms
        .map((_, i) => `posting_body ILIKE $${queryParams.length + i + 1}`)
        .join(' OR ');
      query += ` AND (${bodyConditions})`;
      bodyTerms.forEach(term => queryParams.push(`%${term}%`));
    }
    query += ` LIMIT 100;`;
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});


app.post('/api/volume-stats', async (req, res) => {
  const { make, model, startYear, endYear } = req.body;

  try {
    const baseConditions = `
      make = $1 AND model = $2 AND CAST(year AS INTEGER) BETWEEN $3 AND $4
    `;
    const values = [make, model, startYear, endYear];

    const query = `
      SELECT
        COUNT(*) FILTER (
          WHERE added::timestamp >= NOW() - INTERVAL '60 days'
        ) AS posted_60,
        COUNT(*) FILTER (
          WHERE added::timestamp >= NOW() - INTERVAL '365 days'
        ) AS posted_365,

        COUNT(*) FILTER (
          WHERE activity = 'removed by author' AND updated::timestamp >= NOW() - INTERVAL '60 days'
        ) AS sold_60,
        COUNT(*) FILTER (
          WHERE activity = 'removed by author' AND updated::timestamp >= NOW() - INTERVAL '365 days'
        ) AS sold_365,

        COUNT(*) FILTER (
          WHERE activity = 'listing flagged' AND updated::timestamp >= NOW() - INTERVAL '60 days'
        ) AS flagged_60,
        COUNT(*) FILTER (
          WHERE activity = 'listing flagged' AND updated::timestamp >= NOW() - INTERVAL '365 days'
        ) AS flagged_365,

        COUNT(*) FILTER (
          WHERE activity = 'expired' AND updated::timestamp >= NOW() - INTERVAL '60 days'
        ) AS expired_60,
        COUNT(*) FILTER (
          WHERE activity = 'expired' AND updated::timestamp >= NOW() - INTERVAL '365 days'
        ) AS expired_365

      FROM listings
      WHERE ${baseConditions};
    `;

    const result = await pool.query(query, values);
    const row = result.rows[0];

    res.json({
      "Listings Posted": [parseInt(row.posted_60), parseInt(row.posted_365)],
      "Cars Sold": [parseInt(row.sold_60), parseInt(row.sold_365)],
      "Scams Flagged": [parseInt(row.flagged_60), parseInt(row.flagged_365)],
      "Expired Listings": [parseInt(row.expired_60), parseInt(row.expired_365)]
    });

  } catch (err) {
    console.error('Error fetching volume stats:', err);
    res.status(500).json({ error: 'Failed to fetch volume data' });
  }
});


// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.status(200).send('API is healthy');
});

// Serve static React frontend from build/
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// === After updating this file ===
// # From project root
// cd ~/wheelswatcher/wheelswatcher-app
// git pull origin main

// # Rebuild frontend if needed
// npm install
// npm run build

// # Restart service
// sudo systemctl restart wheelswatcher-combined
