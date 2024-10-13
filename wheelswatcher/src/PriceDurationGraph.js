import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(LinearScale, PointElement, Tooltip, Title, Legend);

const PriceDurationGraph = ({ listings }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (listings.length > 0) {
      // Convert price strings to numbers and calculate days duration
      const formattedData = listings.map(listing => {
        const price = Number(listing.price.replace(/[^0-9.-]+/g, "")); // Remove $ and commas
        const addedDate = new Date(listing.added);
        const updatedDate = new Date(listing.updated);
        const days = Math.ceil((updatedDate - addedDate) / (1000 * 60 * 60 * 24)); // Convert ms to days
        return { x: days, y: price };
      });

      // Find min and max values for scaling
      const minDays = Math.min(...formattedData.map(d => d.x));
      const maxDays = Math.max(...formattedData.map(d => d.x));
      const minPrice = Math.min(...formattedData.map(d => d.y));
      const maxPrice = Math.max(...formattedData.map(d => d.y));

      const buffer = 1.2; // 120% buffer

      setChartData({
        datasets: [
          {
            label: 'Price vs Duration',
            data: formattedData,
            backgroundColor: 'rgba(75, 192, 192, 1)', // Color of the dots
          },
        ],
      });

      setChartOptions({
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Days',
            },
            min: minDays * (1 / buffer), // Scale with buffer
            max: maxDays * buffer,
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Price ($)',
            },
            min: minPrice * (1 / buffer), // Scale with buffer
            max: maxPrice * buffer,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const days = context.raw.x;
                const price = context.raw.y;
                return `Price: $${price}, Days: ${days}`;
              },
            },
          },
        },
      });
    }
  }, [listings]);

  return <Scatter data={chartData} options={chartOptions} />;
};

export default PriceDurationGraph;
