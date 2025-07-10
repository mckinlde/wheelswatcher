import React from 'react';
import { Scatter, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function calculateLinearRegression(data) {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  const sumX = data.reduce((acc, point) => acc + point.x, 0);
  const sumY = data.reduce((acc, point) => acc + point.y, 0);
  const sumXY = data.reduce((acc, point) => acc + point.x * point.y, 0);
  const sumX2 = data.reduce((acc, point) => acc + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function generateTrendlinePoints(data, slope, intercept) {
  const xValues = data.map(point => point.x);
  const [minX, maxX] = [Math.min(...xValues), Math.max(...xValues)];
  return [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];
}

function ScatterPlot({ chartData, xLabel, yLabel, title }) {
  const options = {
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: xLabel, color: '#ffffff' },
        min: 0,
        ticks: { color: '#ffffff' },
      },
      y: {
        title: { display: true, text: yLabel, color: '#ffffff' },
        min: 0,
        ticks: { color: '#ffffff' },
      },
    },
    plugins: {
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const listing = context.raw;
            return `${listing.title || ''}: ${xLabel}: ${listing.x.toFixed(1)}, ${yLabel}: ${listing.y.toFixed(2)}`;
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

function PriceDurationGraph({ listings }) {
  const dataPoints = listings.map((listing) => ({
    x: (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24),
    y: parseFloat(listing.price.replace(/[^0-9.-]+/g, '')),
    title: listing.title,
  })).filter(point => !isNaN(point.x) && !isNaN(point.y));

  const { slope, intercept } = calculateLinearRegression(dataPoints);
  const trendline = generateTrendlinePoints(dataPoints, slope, intercept);

  const chartData = {
    datasets: [
      {
        label: 'Car Listings',
        data: dataPoints,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        pointRadius: 6,
      },
      {
        label: 'Trendline',
        data: trendline,
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 0.8)',
        borderWidth: 2,
        pointRadius: 0,
      }
    ],
  };

  return <ScatterPlot chartData={chartData} xLabel="Days Listed" yLabel="Price ($)" title="Cars Sold" />;
}

function OdometerTimeGraph({ listings }) {
  const dataPoints = listings.map((listing) => ({
    x: (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24),
    y: parseFloat(listing.odometer),
    title: listing.title,
  })).filter(point => !isNaN(point.x) && !isNaN(point.y));

  const { slope, intercept } = calculateLinearRegression(dataPoints);
  const trendline = generateTrendlinePoints(dataPoints, slope, intercept);

  const chartData = {
    datasets: [
      {
        label: 'Car Listings',
        data: dataPoints,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        pointRadius: 6,
      },
      {
        label: 'Trendline',
        data: trendline,
        type: 'line',
        borderColor: 'rgba(153, 102, 255, 0.8)',
        borderWidth: 2,
        pointRadius: 0,
      }
    ],
  };

  return <ScatterPlot chartData={chartData} xLabel="Days Listed" yLabel="Odometer" title="Odometer vs Time" />;
}

function PriceOdometerGraph({ listings }) {
  const dataPoints = listings.map((listing) => ({
    x: parseFloat(listing.odometer),
    y: parseFloat(listing.price.replace(/[^0-9.-]+/g, '')),
    title: listing.title,
  })).filter(point => !isNaN(point.x) && !isNaN(point.y));

  const { slope, intercept } = calculateLinearRegression(dataPoints);
  const trendline = generateTrendlinePoints(dataPoints, slope, intercept);

  const chartData = {
    datasets: [
      {
        label: 'Car Listings',
        data: dataPoints,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        pointRadius: 6,
      },
      {
        label: 'Trendline',
        data: trendline,
        type: 'line',
        borderColor: 'rgba(255, 159, 64, 0.8)',
        borderWidth: 2,
        pointRadius: 0,
      }
    ],
  };

  return <ScatterPlot chartData={chartData} xLabel="Odometer" yLabel="Price ($)" title="Price vs Odometer" />;
}

function VolumeGraph({ volumeData }) {
  const categories = Object.keys(volumeData);
  const past60 = categories.map(cat => volumeData[cat][0]);
  const past365 = categories.map(cat => volumeData[cat][1]);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Past 60 Days',
        data: past60,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Past Year',
        data: past365,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Volume',
        color: '#ffffff',
        font: { size: 18 },
      },
      legend: {
        labels: { color: '#ffffff' }
      },
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#ffffff' },
        title: {
          display: true,
          text: 'Volume',
          color: '#ffffff'
        }
      }
    }
  };

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export {
  PriceDurationGraph,
  OdometerTimeGraph,
  PriceOdometerGraph,
  VolumeGraph
};
