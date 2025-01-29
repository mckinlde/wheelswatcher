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
    y: parseFloat(listing.odometer), // Odometer as y-axis
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

  return <ScatterPlot chartData={chartData} xLabel='Days Listed' yLabel='Odometer' />;
}


function PriceOdometerGraph({ listings }) {
  const dataPoints = listings.map((listing) => ({
    x: parseFloat(listing.odometer), // Odometer as x-axis
    y: parseFloat(listing.price.replace(/[^0-9.-]+/g, '')), // Price as y-axis
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

  return <ScatterPlot chartData={chartData} xLabel='Days Listed' yLabel='Odometer' />;
}


export { PriceDurationGraph, OdometerTimeGraph, PriceOdometerGraph };