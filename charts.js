const buildChartData = (data) => {
  let casesData = [];
  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    casesData.push(newDataPoint);
  }

  return casesData;
};

const buildChartData2 = (data) => {
  let recoveredData = [];
  for (let date in data.deaths) {
    let newDataPoint2 = {
      x: date,
      y: data.deaths[date],
    };
    recoveredData.push(newDataPoint2);
  }

  return recoveredData;
};

const buildChart = (casesData, recoveredData) => {
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Total Cases",
          data: casesData,
          lineTension: 0,
          fill: false,
          borderColor: "#CC1034",

          backgroundColor: "#202128",
          borderDash: [5, 10],
          pointHoverRadius: 1,
          pointHitRadius: 3,
          pointBorderWidth: 0.5,
        },
        {
          label: "Total Deaths",
          data: recoveredData,
          borderColor: "#ffffff",
          lineTension: 0,
          fill: false,
          backgroundColor: "#202128",
          borderDash: [5, 10],
          pointHoverRadius: 1,
          pointHitRadius: 3,
          pointBorderWidth: 0.5,
          BorderWidth: 1,
        },
      ],
    },

    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0a");
              },
            },
          },
        ],
      },
    },
  });
};
