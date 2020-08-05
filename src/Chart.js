import React, { useState, useEffect } from 'react';
import Highcharts, { chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function Chart({ chartData, daysSinceToday, units }) {
  const { dates, weatherData } = chartData;
  const handledChartData = handleData(weatherData, units);
  const chartOptions = {
    title: {
      text: `Evapotranspiration (Previous ${daysSinceToday}days)`,
    },
    yAxis: [
      {
        title: {
          text: `Evapotranspiration (${evapoUnitString(units)})`,
        },
      },
      {
        title: {
          text: 'Mean Solar Radiation',
        },
        opposite: true,
      },
      {
        title: {
          text: `Air Temperature ${tempUnitString(units)}`,
        },
        opposite: true,
      },
    ],
    xAxis: {
      categories: dates.map((date) => date.toDateString()),
      labels: {
        rotation: 45,
      },
    },
    series: [
      {
        type: 'spline',
        name: `Evapotranspiration (${evapoUnitString(units)})`,
        yAxis: 0,
        data: handledChartData.map((data) => data.handledDataEvapotrans),
      },
      {
        type: 'spline',
        name: 'Mean Solar Radiation',
        yAxis: 1,
        data: handledChartData.map((data) => data.handledDataMeanSolarRad),
      },
      {
        type: 'spline',
        name: `Air Temperature ${tempUnitString(units)}`,
        yAxis: 2,
        data: handledChartData.map((data) => data.handledDataTemp),
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
}

function handleData(weatherData, units) {
  return weatherData.map((data) => ({
    ...data,
    handledDataEvapotrans: evapoUnitCorrection(data, units),
    handledDataMeanSolarRad: data.meanSolarRadiationMJ,
    handledDataTemp: tempUnitCorrection(data, units),
  }));
}

function tempUnitString(units) {
  let unitString = '° C';
  if (units === 'standard') {
    unitString = '° F';
  }
  return unitString;
}

function evapoUnitString(units) {
  let unitString = 'mm';
  if (units === 'standard') {
    unitString = 'in';
  }
  return unitString;
}

function evapoUnitCorrection(data, units) {
  if (units === 'metric') {
    return data.evapotranspirationMM;
  }
  if (units === 'standard') {
    return data.evapotranspirationIN;
  }
}

function tempUnitCorrection(data, units) {
  if (units === 'metric') {
    return data.meanDailyAirTemperatureC;
  }
  if (units === 'standard') {
    return parseInt(data.meanDailyAirTemperatureC) * (9 / 5) + 32;
  }
}

export default Chart;
