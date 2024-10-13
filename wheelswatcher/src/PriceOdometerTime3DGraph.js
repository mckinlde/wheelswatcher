import React from 'react';
import Plot from 'react-plotly.js';

function PriceOdometerTime3DGraph({ listings }) {
  const trace = {
    x: listings.map((listing) => parseFloat(listing.odometer)),  // Odometer
    y: listings.map((listing) => (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24)),  // Days listed
    z: listings.map((listing) => parseFloat(listing.price.replace(/[^0-9.-]+/g, ''))),  // Price
    text: listings.map((listing) => listing.title),  // For hover tooltips
    mode: 'markers',
    marker: {
      size: 5,
      color: listings.map((listing) => parseFloat(listing.price.replace(/[^0-9.-]+/g, ''))),  // Color by price
      colorscale: 'Viridis',
      showscale: true,
    },
    type: 'scatter3d',
  };

  return (
    <Plot
      data={[trace]}
      layout={{
        autosize: true,
        height: 600,
        scene: {
          xaxis: { title: 'Odometer' },
          yaxis: { title: 'Price ($)' },
          zaxis: { title: 'Days Listed' },
        },
      }}
    />
  );
}

export default PriceOdometerTime3DGraph;