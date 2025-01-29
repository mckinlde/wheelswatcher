import React from 'react';
import Plot from 'react-plotly.js';

function calculate3DPlane(listings) {
  const points = listings
    .filter(
      (listing) =>
        listing.odometer !== 'Not Found' &&
        !isNaN(parseFloat(listing.odometer)) &&
        !isNaN((new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24)) &&
        !isNaN(parseFloat(listing.price.replace(/[^0-9.-]+/g, '')))
    )
    .map((listing) => ({
      x: parseFloat(listing.odometer),
      y: (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24),
      z: parseFloat(listing.price.replace(/[^0-9.-]+/g, '')),
    }));

  if (points.length < 3) return null; // Not enough points for a trend plane

  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumZ = points.reduce((sum, p) => sum + p.z, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXZ = points.reduce((sum, p) => sum + p.x * p.z, 0);
  const sumYZ = points.reduce((sum, p) => sum + p.y * p.z, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
  const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

  const denominator = n * sumX2 * sumY2 + 2 * sumX * sumY * sumXY - sumX * sumX * sumY2 - sumY * sumY * sumX2 - n * sumXY * sumXY;
  if (denominator === 0) return null;

  const a = (n * sumXZ * sumY2 + sumY * sumYZ * sumX - sumY * sumX * sumXZ - sumYZ * sumY * sumX2) / denominator;
  const b = (n * sumYZ * sumX2 + sumX * sumXZ * sumY - sumX * sumY * sumYZ - sumXZ * sumX * sumY2) / denominator;
  const c = (sumZ - a * sumX - b * sumY) / n;

  return { a, b, c };
}

function generateTrendPlaneData({ a, b, c }, xRange, yRange) {
  const [minX, maxX] = xRange;
  const [minY, maxY] = yRange;

  return {
    x: [minX, maxX, minX, maxX],
    y: [minY, minY, maxY, maxY],
    z: [
      a * minX + b * minY + c,
      a * maxX + b * minY + c,
      a * minX + b * maxY + c,
      a * maxX + b * maxY + c,
    ],
    type: 'mesh3d',
    opacity: 0.5,
    color: 'rgba(255, 99, 132, 0.6)'
  };
}

function PriceOdometerTime3DGraph({ listings }) {
  const validListings = listings.filter(
    (listing) =>
      listing.odometer !== 'Not Found' &&
      !isNaN(parseFloat(listing.odometer)) &&
      !isNaN((new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24)) &&
      !isNaN(parseFloat(listing.price.replace(/[^0-9.-]+/g, '')))
  );

  const trace = {
    x: validListings.map((listing) => parseFloat(listing.odometer)),
    y: validListings.map((listing) => (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24)),
    z: validListings.map((listing) => parseFloat(listing.price.replace(/[^0-9.-]+/g, ''))),
    text: validListings.map((listing) => listing.title),
    mode: 'markers',
    marker: {
      size: 5,
      color: validListings.map((listing) => parseFloat(listing.price.replace(/[^0-9.-]+/g, ''))),
      colorscale: 'Viridis',
      showscale: true,
    },
    type: 'scatter3d',
  };

  const regressionPlane = calculate3DPlane(validListings);

  const planeTrace = regressionPlane
    ? generateTrendPlaneData(
        regressionPlane,
        [Math.min(...trace.x), Math.max(...trace.x)],
        [Math.min(...trace.y), Math.max(...trace.y)]
      )
    : null;

  const data = planeTrace ? [trace, planeTrace] : [trace];

  return (
    <Plot
      data={data}
      layout={{
        autosize: true,
        height: 600,
        scene: {
          xaxis: { title: 'Odometer' },
          yaxis: { title: 'Days Listed' },
          zaxis: { title: 'Price ($)' },
        },
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',
        font: { color: '#ffffff' },
      }}
    />
  );
}

export default PriceOdometerTime3DGraph;
