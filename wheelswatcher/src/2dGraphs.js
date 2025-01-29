import React from 'react';
import { Scatter } from 'react-chartjs-2';
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
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  return [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];
}

function ScatterPlot({ chartData, xLabel, yLabel }) {
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
  }));

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

  return <ScatterPlot chartData={chartData} xLabel='Days Listed' yLabel='Price ($)' />;
}

function OdometerTimeGraph({ listings }) {
  const dataPoints = listings.map((listing) => ({
    x: (new Date(listing.updated) - new Date(listing.added)) / (1000 * 60 * 60 * 24),
    y: parseFloat(listing.odometer),
    title: listing.title,
  }));

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

  return <ScatterPlot chartData={chartData} xLabel='Days Listed' yLabel='Odometer' />;
}

function PriceOdometerGraph({ listings }) {
  const dataPoints = listings.map((listing) => ({
    x: parseFloat(listing.odometer),
    y: parseFloat(listing.price.replace(/[^0-9.-]+/g, '')),
    title: listing.title,
  }));

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

  return <ScatterPlot chartData={chartData} xLabel='Odometer' yLabel='Price ($)' />;
}

export { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph };