window.onload = () => {
  getCountriesData();
  //   getHistoricalData();
  getWorldCoronaData();
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
const wordwideSelection = {
  name: "Worldwide",
  value: "www",
  selected: true,
};
var casesTypeColors = {
  cases: "#7F3554",
  active: "#9d80fe",
  recovered: "#7dd71d",
  deaths: "#ffffff",
};
const mapCenter = {
  lat: 10.80746,
  lng: -5.4796,
};
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: 3,
    minZoom: 2,
    styles: mapStyle,
    disableDefaultUI: true,
  });
  infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (casesType) => {
  clearTheMap();
  showDataOnMap(coronaGlobalData, casesType);
};

const clearTheMap = () => {
  for (let circle of mapCircles) {
    circle.setMap(null);
  }
};

const setMapCenter = (lat, long, zoom) => {
  map.setZoom(zoom);
  map.panTo({
    lat: lat,
    lng: long,
  });
};

const initDropdown = (searchList) => {
  $(".ui.dropdown").dropdown({
    values: searchList,
    onChange: function (value, text) {
      if (value !== wordwideSelection.value) {
        getCountryData(value);
      } else {
        getWorldCoronaData();
      }
    },
  });
};

const setSearchList = (data) => {
  let searchList = [];
  searchList.push(wordwideSelection);
  data.forEach((countryData) => {
    searchList.push({
      name: countryData.country,
      value: countryData.countryInfo.iso3,
    });
  });
  initDropdown(searchList);
};

const getCountriesData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalData = data;
      setSearchList(data);
      showDataOnMap(data);
      showDataInTable(data);
    });
};

const getCountryData = (countryIso) => {
  const url = "https://disease.sh/v3/covid-19/countries/" + countryIso;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setMapCenter(data.countryInfo.lat, data.countryInfo.long, 3);
      setStatsData(data);
    });
};
const getWorldCoronaData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setStatsData(data);
      setMapCenter(mapCenter.lat, mapCenter.lng, 2);
    });
};

const setStatsData = (data) => {
  let addedCases = numeral(data.todayCases).format("+0,0");
  let addedRecovered = numeral(data.todayRecovered).format("+0,0");
  let addedDeaths = numeral(data.todayDeaths).format("+0,0");
  let totalCases = numeral(data.cases).format("0.0a");
  let totalRecovered = numeral(data.recovered).format("0.0a");
  let totalDeaths = numeral(data.deaths).format("0.0a");
  document.querySelector(".total-number").innerHTML = addedCases;
  document.querySelector(".recovered-number").innerHTML = addedRecovered;
  document.querySelector(".deaths-number").innerHTML = addedDeaths;
  document.querySelector(".cases-total").innerHTML = `${totalCases}`;
  document.querySelector(".recovered-total").innerHTML = `${totalRecovered}`;
  document.querySelector(".deaths-total").innerHTML = `${totalDeaths}`;

  //   Updating country name on side bar
  var html = `<h2>${data.country}</h2>`;
  if (data.country == undefined) {
    document.querySelector(".country-name").innerHTML = "<h2>Worldwide</h2>";
  } else {
    document.querySelector(".country-name").innerHTML = html;
  }
};

// const getHistoricalData = () => {
//   fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       let chartData = buildChartData(data);
//       //   let chartData2 = buildChartData2(data);
//       buildChart(chartData);
//       //   buildChart(chartData2);
//     });
// };

const openInfoWindow = () => {
  infoWindow.open(map);
};

const showDataOnMap = (data, casesType = "cases") => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: casesTypeColors[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType],
    });

    mapCircles.push(countryCircle);

    var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered}
                </div>
                <div class="info-deaths">   
                    Deaths: ${country.deaths}
                </div>
            </div>
        `;

    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
    <tr>
    <td><img src="${
      country.countryInfo.flag
    }" style="width:20px;height:20px;"></img></td>
    <td>${country.country}
    <div class="progress" style="height: 3px;">
      <div class="progress-bar bg-danger" role="progressbar" style="width: ${
        (country.cases / (country.cases + country.recovered)) * 100
      }%" aria-valuenow="${
      country.cases
    }" aria-valuemin="0" aria-valuemax="100"></div>
      <div class="progress-bar bg-success" role="progressbar" style="width: ${
        (country.recovered / (country.cases + country.recovered)) * 100
      }%" aria-valuenow="${
      country.recovered
    }" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    </td>
    <td>${numeral(country.cases).format("0,0")}</td>   
    
</tr>
        `;
  });
  document.getElementById("table-data").innerHTML = html;
};

// console.log(document.querySelector(".text").innerHTML);
