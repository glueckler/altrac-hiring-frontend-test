import React, { useState, useEffect } from 'react';
import Highcharts, { chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function Chart({ chartData, daysSinceToday, todaysDateObject, units }) {
  const seriesDefaults = {
    pointStart: todaysDateObject.getTime() - 24 * 36e5 * daysSinceToday,
    pointInterval: 24 * 36e5,
    type: 'spline',
  };
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
      type: 'datetime',
      labels: {
        format: '{value:%Y-%m-%d}',
        rotation: 45,
        align: 'left',
      },
    },
    series: [
      {
        ...seriesDefaults,
        name: `Evapotranspiration (${evapoUnitString(units)})`,
        yAxis: 0,
        data: evapoUnitCorrection(chartData, units),
      },
      {
        ...seriesDefaults,
        name: 'Mean Solar Radiation',
        yAxis: 1,
        data: chartData.map((datas) => datas.meanSolarRadiationMJ),
      },
      {
        ...seriesDefaults,
        name: `Air Temperature ${tempUnitString(units)}`,
        yAxis: 2,
        data: tempUnitCorrection(chartData, units),
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
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
    return data.map((datas) => datas.evapotranspirationMM);
  }
  if (units === 'standard') {
    return data.map((datas) => datas.evapotranspirationIN);
  }
}

function tempUnitCorrection(data, units) {
  if (units === 'metric') {
    return data.map((datas) => datas.meanDailyAirTemperatureC);
  }
  if (units === 'standard') {
    return data.map(
      (datas) => parseInt(datas.meanDailyAirTemperatureC) * (9 / 5) + 32
    );
  }
}

export default Chart;
