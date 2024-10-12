const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection pool (adjust credentials to your RDS instance)
const pool = new Pool({
  user: 'postgres',
  host: 'database-1.cluster-ro-cvu2u86aui5t.us-west-2.rds.amazonaws.com',
  database: 'seattlecars',
  password: 'kellybluebook',
  port: 5432,  // Or your RDS port
});


// Endpoint to run a SELECT query based on dropdown inputs
app.post('/query-listings', async (req, res) => {
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

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
