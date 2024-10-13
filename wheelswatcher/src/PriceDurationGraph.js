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
