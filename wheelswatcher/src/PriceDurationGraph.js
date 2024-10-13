import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';  // Required for Chart.js

const PriceDurationGraph = ({ listings }) => {
  const data = {
    labels: listings.map(listing => {
      const addedDate = new Date(listing.added);
      const updatedDate = new Date(listing.updated);
      const diffTime = Math.abs(updatedDate - addedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Round to nearest day
      return diffDays;
    }),
    datasets: [
      {
        label: 'Price (USD)',
        data: listings.map(listing => {
          const priceValue = parseInt(listing.price.replace(/\D/g, ''), 10);
          return priceValue;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days Listed',
        },
        min: 0,
        max: Math.ceil(Math.max(...data.labels) * 1.1),  // Round max days to whole number and 110% of max
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
        min: 0,
        max: Math.ceil(Math.max(...data.datasets[0].data) * 1.1),  // Round max price to whole number and 110% of max
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const title = listings[context.dataIndex].title;
            const price = context.raw.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });
            return `${title}: ${price}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Price vs Days Listed</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceDurationGraph;
