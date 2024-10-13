import React from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';

function PriceDurationGraph({ listings }) {
  // Parse listings into chart data
  const chartData = {
    datasets: [{
      label: 'Car Listings',
      data: listings.map((listing) => ({
        x: (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24), // Convert time to days
        y: parseFloat(listing.price.replace(/[^0-9.-]+/g, '')), // Extract the numeric price
        title: listing.title, // Include title for tooltip
      })),
      backgroundColor: 'rgba(75, 192, 192, 0.6)', // Customize dot color
      pointRadius: 6, // Increase point size for better visibility
    }],
  };

  // Find the max values for price and days to extend the axes
  const maxDays = Math.max(...listings.map((listing) => (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24)));
  const maxPrice = Math.max(...listings.map((listing) => parseFloat(listing.price.replace(/[^0-9.-]+/g, ''))));

  // Chart options
  const options = {
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Days Listed',
          color: '#ffffff', // Label color
        },
        min: 0, // Start at 0
        max: Math.ceil(Math.max(maxDays * 1.1)),  // Round max price to whole number and 11
        ticks: {
          color: '#ffffff', // Tick color
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
          color: '#ffffff', // Label color
        },
        min: 0, // Start at 0
        max: Math.ceil(Math.max(maxPrice * 1.1)),  // Round max price to whole number and 11
        ticks: {
          color: '#ffffff', // Tick color
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          // Customize tooltip to show the title on hover
          label: function (context) {
            const listing = context.raw;
            return `${listing.title}: $${listing.y.toFixed(2)}, Days: ${listing.x.toFixed(1)}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Scatter data={chartData} options={options} />
    </div>
  );
}

function OdometerTimeGraph({ listings }) {
  const chartData = {
    datasets: [{
      label: 'Car Listings',
      data: listings.map((listing) => ({
        x: (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24), // Days as x-axis
        y: parseFloat(listing.odometer), // Odometer as y-axis
        title: listing.title,
      })),
      backgroundColor: 'rgba(255, 206, 86, 0.6)', // Customize dot color
      pointRadius: 6,
    }],
  };

  const maxDays = Math.max(...listings.map((listing) => (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24)));
  const maxOdometer = Math.max(...listings.map((listing) => parseFloat(listing.odometer)));

  const options = {
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Days Listed', color: '#ffffff' },
        min: 0,
        max: Math.ceil(maxDays * 1.1),
        ticks: { color: '#ffffff' },
      },
      y: {
        title: { display: true, text: 'Odometer', color: '#ffffff' },
        min: 0,
        max: Math.ceil(maxOdometer * 1.1),
        ticks: { color: '#ffffff' },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const listing = context.raw;
            return `${listing.title}: Days: ${listing.x.toFixed(1)}, Odometer: ${listing.y}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Scatter data={chartData} options={options} />
    </div>
  );
}


function PriceOdometerGraph({ listings }) {
  const chartData = {
    datasets: [{
      label: 'Car Listings',
      data: listings.map((listing) => ({
        x: parseFloat(listing.odometer), // Odometer as x-axis
        y: parseFloat(listing.price.replace(/[^0-9.-]+/g, '')), // Price as y-axis
        title: listing.title,
      })),
      backgroundColor: 'rgba(54, 162, 235, 0.6)', // Customize dot color
      pointRadius: 6,
    }],
  };

  const maxOdometer = Math.max(...listings.map((listing) => parseFloat(listing.odometer)));
  const maxPrice = Math.max(...listings.map((listing) => parseFloat(listing.price.replace(/[^0-9.-]+/g, ''))));

  const options = {
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Odometer', color: '#ffffff' },
        min: 0,
        max: Math.ceil(maxOdometer * 1.1),
        ticks: { color: '#ffffff' },
      },
      y: {
        title: { display: true, text: 'Price ($)', color: '#ffffff' },
        min: 0,
        max: Math.ceil(maxPrice * 1.1),
        ticks: { color: '#ffffff' },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const listing = context.raw;
            return `${listing.title}: $${listing.y.toFixed(2)}, Odometer: ${listing.x}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Scatter data={chartData} options={options} />
    </div>
  );
}


export { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph };
