"use strict"
// Global Variables
let wayptDistanceArr = [];
var weatherTempArr = [];

getCountryOptions1();
getCountryOptions2();

// function for generating port options from selected Country
function generatePortOptions(options)
{
  let outputHTML = "";
  outputHTML += "<option value ='" + options._portName + "'>" + options._portName + "(" + options._portType+ ")"+ "</option>";
  return outputHTML;
}

function generateShipOptions(options)
{
  let outputHTML = "";
  let shipMaxSpeed = parseInt(options._shipMaxSpeed);
  outputHTML += "<option value ='" + options._shipName + "'>" + "<b>" + options._shipName + "</b>" + " (Max speed: " + shipMaxSpeed.toFixed(1) + "km/h)" + "</option>" ;
  return outputHTML;
}

// function for generating the option bar for countries to search ports by
function generateCountryOptions(options1, options2)
{
  let outputHTML = "";
  let sortedCountryArr = [];
  for (let i=0; i<options1.length; i++)
  {
    sortedCountryArr.push(options1[i]);
  }
  for (let i = 0; i < options2.length; i++)
  {
    sortedCountryArr.push(options2[i]);
  }

  sortedCountryArr.sort();

  for (let j=0; j<sortedCountryArr.length; j++)
  {
    outputHTML += "<option value ='" + sortedCountryArr[j] + "'>" + sortedCountryArr[j] + "</option>";
  }
  return outputHTML;
}

// function to get the country options
function getCountryOptions1()
{
  let outputHTMLref = document.getElementById("departPortCountry");
  let outputHTML = "<option>Select a country</option>";
  let optionArrAPI = getOptionsArrAPI();
  let optionArrAdded = getOptionsArrAdded();
  outputHTML += generateCountryOptions(optionArrAPI,optionArrAdded);
  outputHTMLref.innerHTML = outputHTML;
}

// function to get the country options
function getCountryOptions2()
{
  let outputHTMLref = document.getElementById("arrivalPortCountry");
  let outputHTML = "<option>Select a country</option>";
  let optionArrAPI = getOptionsArrAPI();
  let optionArrAdded = getOptionsArrAdded();
  outputHTML += generateCountryOptions(optionArrAPI,optionArrAdded);
  outputHTMLref.innerHTML = outputHTML;
}

// function to get the port data of the selected country
function getPortOptions1()
{
  let chosenCountry = document.getElementById('departPortCountry').value;
  let portHTMLref = document.getElementById('newDepartPort');
  let portHTML = "<option value = '0'>Select a port</option>";
  let portsAPIArr = getPortsArrAPI();
  for (let i = 0; i < portsAPIArr.length; i++)
  {
    let portLS = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
    portLS.getData(portsAPIArr[i]);
    if (portLS._portCountry == chosenCountry)
    {
      portHTML += generatePortOptions(portLS);
    }
  }
  let newPortsArr = getPortsArrAdded();
  for (let i = 0; i < newPortsArr.length; i++)
  {
    let portLS = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
    portLS.getData(newPortsArr[i]);
    if (portLS._portCountry == chosenCountry)
    {
      portHTML += generatePortOptions(portLS);
    }
  }
  portHTMLref.innerHTML = portHTML;
}

function getPortOptions2()
{
  let chosenCountry = document.getElementById('arrivalPortCountry').value;
  let portHTMLref = document.getElementById('newArrivalPort');
  let portHTML = "<option value = '0'>Select a port</option>";
  let portsAPIArr = getPortsArrAPI();
  for (let i = 0; i < portsAPIArr.length; i++)
  {
    let portLS = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
    portLS.getData(portsAPIArr[i]);
    if (portLS._portCountry == chosenCountry)
    {
      portHTML += generatePortOptions(portLS);
    }
  }
  let newPortsArr = getPortsArrAdded();
  for (let i = 0; i < newPortsArr.length; i++)
  {
    let portLS = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
    portLS.getData(newPortsArr[i]);
    if (portLS._portCountry == chosenCountry)
    {
      portHTML += generatePortOptions(portLS);
    }
  }
  portHTMLref.innerHTML = portHTML;
}

function route1()
{
  let routeID = document.getElementById('newRouteID').value;
  let departPort = document.getElementById('newDepartPort').value;
  let arrivalPort = document.getElementById('newArrivalPort').value;
  let inputDate = document.getElementById('departureDate').value;
  let inputDateStr = inputDate.toString();
  let departureDate = inputDateStr.substring(8,10) + "." + inputDateStr.substring(5,7) + "." + inputDateStr.substring(0,4);
  let newRouteData =
  {
    routeID: routeID,
    departPort: departPort,
    arrivalPort: arrivalPort,
    departureDate: departureDate
  };
  storeNewRouteData(newRouteData);
}

// Onload function for distance calculation, display for create_route1.html inputs and weather for departure port/time
function loadNewRouteData()
{
  let newRouteData = getNewRouteData();
  let portsAPIArr = getPortsArrAPI();
  let newPortsArr = getPortsArrAdded();
  let routeID = newRouteData.routeID;
  let departPortName = newRouteData.departPort;
  let departPort = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
  for (let i = 0; i < portsAPIArr.length; i++)
  {
    if (portsAPIArr[i]._portName === departPortName)
    {
      departPort.getData(portsAPIArr[i]);
    }
  }
  for (let i = 0; i < newPortsArr.length; i++)
  {
    if (newPortsArr[i]._portName === departPortName)
    {
      departPort.getData(newPortsArr[i]);
    }
  }
  let arrivalPortName = newRouteData.arrivalPort;
  let arrivalPort = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
  for (let i = 0; i < portsAPIArr.length; i++)
  {
    if (portsAPIArr[i]._portName === arrivalPortName)
    {
      arrivalPort.getData(portsAPIArr[i]);
    }
  }
  for (let i = 0; i < newPortsArr.length; i++)
  {
    if (newPortsArr[i]._portName === arrivalPortName)
    {
      arrivalPort.getData(newPortsArr[i]);
    }
  }
  let departureDate = newRouteData.departureDate;

  // Map Area
  mapboxgl.accessToken = 'pk.eyJ1IjoiamxlZTAxMDAiLCJhIjoiY2swYnZ6c2JjMHl4cDNtcGxuaGRkanMybyJ9.fM36Y4-CMbfoGbJ-8CgrMg';
  var map = new mapboxgl.Map({
    container: 'mapArea', // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [90, 10], // starting position [lng, lat]
    zoom: 1 // starting zoom
  });

  let departPortCoor = [departPort._portLng, departPort._portLat];
  let marker1 = new mapboxgl.Marker({ "color": "#F7455D" });
  let popup1 = new mapboxgl.Popup({closeOnClick: false, closeButton: false})
  popup1.setHTML("Depart From: " + departPort._portName);
  marker1.setLngLat(departPortCoor);
  marker1.setPopup(popup1);
  marker1.addTo(map);
  popup1.addTo(map);

  let arrivalPortCoor = [arrivalPort._portLng,arrivalPort._portLat];
  let marker2 = new mapboxgl.Marker({ "color": "#F7455D" });
  let popup2 = new mapboxgl.Popup({closeOnClick: false, closeButton: false})
  popup2.setHTML("Arrive At: " + arrivalPort._portName);
  marker2.setLngLat(arrivalPortCoor);
  marker2.setPopup(popup2);
  marker2.addTo(map);
  popup2.addTo(map);

  map.fitBounds([departPortCoor, arrivalPortCoor], {
    padding: 100
  });

  let linesCoorArr = [departPortCoor, arrivalPortCoor];

  map.on('load', function () {
    map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": linesCoorArr
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": '#FFA500',
        "line-width": 5
      }
    });
  });

  let waypointOutput = "";
  let i = 1; //set index for each waypoints
  let waypointsCoorArr = [];
  let distance;

  //calculating initial travelDistance
  const R = 6371; // kilometres
  let departPortLat = departPortCoor[1]*(Math.PI/180); //latitudes
  let arrivalPortLat = arrivalPortCoor[1]*(Math.PI/180);
  let latDiff = (arrivalPortCoor[1] - departPortCoor[1])*(Math.PI/180);
  let lngDiff = (arrivalPortCoor[0] - departPortCoor[0])*(Math.PI/180); //longtitudes

  var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
          Math.cos(departPortLat) * Math.cos(arrivalPortLat) *
          Math.sin(lngDiff/2) * Math.sin(lngDiff/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  distance = R * c;
  document.getElementById('distance').innerHTML = "Route distance: " + distance.toFixed(1) + " km";

  // Show list of available ships based on ship status and initial route distance
  let shipsHTMLref = document.getElementById('ship');
  let shipsHTML = "";
  let shipsAPIArr = getShipsArrAPI();
  let newShipsArr = getShipsArrAdded();
  for(let i = 0; i<shipsAPIArr.length; i++)
  {
    let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
    shipLS.getData(shipsAPIArr[i]);
    if (shipLS._shipStatus == "available" && shipLS._shipRange >= distance)
    {
      shipsHTML += generateShipOptions(shipLS);
    }
  }
  for(let i = 0; i<newShipsArr.length; i++)
  {
    let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
    shipLS.getData(newShipsArr[i]);
    if (shipLS._shipStatus == "available" && shipLS._shipRange >= distance)
    {
      shipsHTML += generateShipOptions(shipLS);
    }
  }
  if (shipsHTML == "")
  {
    shipsHTML = "<option> No available ships for this distance </option>";
  }
  shipsHTMLref.innerHTML = shipsHTML;

  //function when clicking on map
  map.on('click', function(e){
    map.removeLayer('route'); //remove previous lines to draw again
    map.removeSource('route');

    if (i > 1) //remove previous points to draw again
    {
      map.removeLayer('measure-points');
      map.removeSource('measure-points');
    }

    linesCoorArr.pop(); //redefine coordinates in the array
    let waypointCoor = [e.lngLat.wrap().lng, e.lngLat.wrap().lat];
    linesCoorArr.push(waypointCoor);
    linesCoorArr.push(arrivalPortCoor);
    waypointsCoorArr.push(waypointCoor);

    //store waypointsCoorArr
    storeWaypointsCoorArr(waypointsCoorArr);

    waypointOutput += "<tr><td class='mdl-data-table__cell--non-numeric'>"+i+"</td>";
    waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>[" + linesCoorArr[i][0].toFixed(3) + ", " + linesCoorArr[i][1].toFixed(3) + "]</td>";
    waypointOutput += "<td class='mdl-data-table__cell--non-numeric'></td>";
    document.getElementById("waypointOutput").innerHTML = waypointOutput;
    i++;

    //add points
    map.addLayer({
      "id": "measure-points",
      "type": "circle",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": waypointsCoorArr
          },
        },
      },
      "paint": {
        "circle-radius": 12,
        "circle-color": '#ED2939'
      },
    });

    //add lines
    map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": linesCoorArr
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": '#FFA500',
        "line-width": 5
      }
    })

    // adding waypoints' distance
    let distance = 0; //resets distance to 0
    wayptDistanceArr = [];

    for (let i=0; i<linesCoorArr.length-1; i++)
    {
      const R = 6371; // kilometres
      let portALat = linesCoorArr[i][1]*(Math.PI/180); //latitudes
      let portBLat = linesCoorArr[i+1][1]*(Math.PI/180);
      let latDiff = (linesCoorArr[i+1][1] - linesCoorArr[i][1])*(Math.PI/180);
      let lngDiff = (linesCoorArr[i+1][0] - linesCoorArr[i][0])*(Math.PI/180); //longtitudes

      var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
              Math.cos(portALat) * Math.cos(portBLat) *
              Math.sin(lngDiff/2) * Math.sin(lngDiff/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance += R * c;
      wayptDistanceArr.push(distance);
    }
    for (let i=0;i<wayptDistanceArr.length; i++)
    {alert(wayptDistanceArr[i])}

    document.getElementById('distance').innerHTML = "Route distance: " + distance.toFixed(1) + " km";
    document.getElementById("travelDistance").innerHTML = distance.toFixed(1) + " km" ;

    // ships options for distance after adding waypoints
    let shipsHTMLref = document.getElementById('ship');
    let shipsHTML = "";
    let shipsAPIArr = getShipsArrAPI();
    let newShipsArr = getShipsArrAdded();
    for(let i = 0; i<shipsAPIArr.length; i++)
    {
      let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
      shipLS.getData(shipsAPIArr[i]);
      if (shipLS._shipStatus == "available" && shipLS._shipRange >= distance)
      {
        shipsHTML += generateShipOptions(shipLS);
      }
    }
    for(let i = 0; i<newShipsArr.length; i++)
    {
      let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
      shipLS.getData(newShipsArr[i]);
      if (shipLS._shipStatus == "available" && shipLS._shipRange >= distance)
      {
        shipsHTML += generateShipOptions(shipLS);
      }
    }
    if (shipsHTML == "")
    {
      shipsHTML = "<option> No available ships for this distance </option>";
    }
    shipsHTMLref.innerHTML = shipsHTML;
  }); // end of onclick function


  // Display weather on DEPARTURE port/date
  let departLng = departPort._portLng;
  let departLat = departPort._portLat;
  let departDay = newRouteData.departureDate.toString();
  let departDayStr = departDay[3] + departDay[4] + "." + departDay[0] + departDay[1] + "." + departDay[6] + departDay[7] + departDay[8] + departDay[9];
  let currentUnixTime = (new Date().getTime()/1000).toFixed(0);
  let departUnixTime = (new Date(departDayStr).getTime()/1000).toFixed(0);

  // Check if departure date is within 7 days of current date
  let forecastLimit = 7*24*60*60; // forecast limit (7 days) in seconds
  if (departUnixTime - currentUnixTime < forecastLimit)
  {
    let key = "53b2cd8a39639ff54c7c1e9ed5df880e";
    let data =
    {
      callback: "departWeatherData"
    }
    darkSkyRequest(key,departLat,departLng,data,departUnixTime);
  }
  else if (departUnixTime - currentUnixTime > forecastLimit)
  {
    alert("Forecast data is unavailable if the departure date is more than 7 days from current date. Please check again within 7 days of departure.");
    document.getElementById("departWeather").innerHTML = "Unavailable (available within 7 days of departure date)";
  }

  // Route details display table onload
  document.getElementById("routeID").innerHTML = routeID;
  document.getElementById("departPort").innerHTML = departPort._portName;
  document.getElementById("departPortCountry").innerHTML = departPort._portCountry.toUpperCase();
  document.getElementById("destiPort").innerHTML = arrivalPort._portName;
  document.getElementById("destiPortCountry").innerHTML = arrivalPort._portCountry.toUpperCase();
  document.getElementById("departDate").innerHTML = departureDate;
  document.getElementById("travelDistance").innerHTML = distance.toFixed(1);
}
//end of onload function

function removeWaypoints()
{
  localStorage.removeItem(STORAGE_KEY_WAYPOINTS); //clear waypointsCoorArr in localStorage
  location.reload(); //reload page
}

function departWeatherData(departWeatherData)
{
  let departWeather = departWeatherData.currently.summary;
  let departTemp = (((departWeatherData.currently.temperature)-32)*5/9).toFixed(0) + "&#8451";
  let weatherTempStr =  departWeather + " (" + departTemp + ") ";

  document.getElementById("departWeather").innerHTML = weatherTempStr.toString();
}

function arrivalWeatherData(arrivalWeatherData)
{
  let arrivalWeather = arrivalWeatherData.currently.summary;
  let arrivalTemp = (((arrivalWeatherData.currently.temperature)-32)*5/9).toFixed(0) + "&#8451";
  let weatherTempStr =  arrivalWeather + " (" + arrivalTemp + ") ";

  document.getElementById("arrivalWeather").innerHTML = weatherTempStr.toString();
}

function waypointWeatherData(waypointWeatherData)
{
  let waypointsCoorArr = [];
  waypointsCoorArr = JSON.parse(localStorage.getItem(STORAGE_KEY_WAYPOINTS));
  document.getElementById("waypointOutput").innerHTML = "";

  let waypointWeather = waypointWeatherData.currently.summary;
  let waypointTemp = (((waypointWeatherData.currently.temperature)-32)*5/9).toFixed(0) + "&#8451";
  let weatherTempStr =  waypointWeather + " (" + waypointTemp + ") ";
  weatherTempArr.push(weatherTempStr);

  if (waypointWeatherData !== null)
  {
    for (let i=0; i < waypointsCoorArr.length; i++)
    {
      if (weatherTempArr[i] !== undefined)
      {
        let waypointOutput = "<tr><td class='mdl-data-table__cell--non-numeric'>"+(i+1)+"</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>[" + waypointsCoorArr[i][0].toFixed(3) + ", " + waypointsCoorArr[i][1].toFixed(3) + "]</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>" + weatherTempArr[i] + "</td></tr>";

        document.getElementById("waypointOutput").innerHTML += waypointOutput;
      }
      else if (weatherTempArr[i] == undefined)
      {
        let waypointOutput = "<tr><td class='mdl-data-table__cell--non-numeric'>"+(i+1)+"</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>[" + waypointsCoorArr[i][0].toFixed(3) + ", " + waypointsCoorArr[i][1].toFixed(3) + "]</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>Unavailable</td></tr>";

        document.getElementById("waypointOutput").innerHTML += waypointOutput;
      }
    }
  }
}

// Calculation and display of route time, cost and arrival weather after "confirmShip" button is clicked
function confirmShip()
{
  // Display weather on ARRIVAL port/date, Calculation for route time and cost
  let routeTime;
  let portsAPIArr = getPortsArrAPI();
  let newPortsArr = getPortsArrAdded();
  let selectedShip = document.getElementById("ship").value;

  let newRouteData = getNewRouteData();
  let arrivalPortName = newRouteData.arrivalPort;
  let arrivalPort = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");

  for (let i = 0; i < portsAPIArr.length; i++)
  {
    if (portsAPIArr[i]._portName === arrivalPortName)
    {
      arrivalPort.getData(portsAPIArr[i]);
    }
  }

  for (let i = 0; i < newPortsArr.length; i++)
  {
    if (newPortsArr[i]._portName === arrivalPortName)
    {
      arrivalPort.getData(newPortsArr[i]);
    }
  }

  let arrivalLng = arrivalPort._portLng;
  let arrivalLat = arrivalPort._portLat;

  let currentUnixTime = parseInt((new Date().getTime()/1000).toFixed(0));
  let forecastLimit = 7*24*60*60; // forecast limit (7 days) in seconds

  let waypointsCoorArr = getWaypointsCoorArr();
  let shipsAPIArr = getShipsArrAPI();
  let newShipsArr = getShipsArrAdded();
  document.getElementById("waypointOutput").innerHTML = "";

  for (let i = 0; i < shipsAPIArr.length; i++)
  {
    let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
    shipLS.getData(shipsAPIArr[i]);

    if (shipLS._shipName == selectedShip)
    {
      document.getElementById("shipRoute").innerHTML = shipLS._shipName;
      for (let i = 0; i < waypointsCoorArr.length; i++)
      {
        let wayptLng = waypointsCoorArr[i][0];
        let wayptLat = waypointsCoorArr[i][1];
        let wayptDistance = wayptDistanceArr[i];
        let shipSpeed = shipLS._shipMaxSpeed;
        let wayptTime = (wayptDistance/shipSpeed)*60*60;
        let wayptUnixTime = currentUnixTime + wayptTime;

        if (wayptUnixTime - currentUnixTime < forecastLimit)
        {
          let script = document.createElement('script');
          script.src = "https://api.darksky.net/forecast/53b2cd8a39639ff54c7c1e9ed5df880e/" + wayptLat.toFixed(4) + "," + wayptLng.toFixed(4) + "," + wayptUnixTime.toFixed(0) + "?callback=waypointWeatherData";
          document.body.appendChild(script);
        }
      }

      let selectedShipSpeed = parseInt(shipLS._shipMaxSpeed);
      let selectedShipCost = parseInt(shipLS._shipCost)
      let routeDistance = parseInt(document.getElementById("travelDistance").innerHTML);
      let routeTime = routeDistance / selectedShipSpeed;
      let routeCost = routeDistance * selectedShipCost;
      document.getElementById("travelTime").innerHTML = Math.floor((routeTime)/24) + " Days " + Math.round((routeDistance/selectedShipSpeed) % 24) + " Hours";
      document.getElementById("travelCost").innerHTML = routeCost;

      let newRouteData = getNewRouteData();
      let departDay = newRouteData.departureDate.toString();
      let departDayStr = departDay[3] + departDay[4] + "." + departDay[0] + departDay[1] + "." + departDay[6] + departDay[7] + departDay[8] + departDay[9];
      let departUnixTime = (new Date(departDayStr).getTime()/1000).toFixed(0);
      let arrivalUnixTime = currentUnixTime + Math.round(routeTime*60*60); // routeTime in seconds added to currentUnixTime
      let arrivalDate = new Date(departDayStr);
      arrivalDate.setHours(arrivalDate.getHours() + Number(routeTime));
      let arrivalDateStr = arrivalDate.getDate() + "." + (arrivalDate.getMonth()+1) + "." + arrivalDate.getFullYear();
      document.getElementById("arriveDate").innerHTML = arrivalDateStr;
      // Check if arrival date is within 7 days of current date
      if (arrivalUnixTime - currentUnixTime < forecastLimit)
      {
        let key = "53b2cd8a39639ff54c7c1e9ed5df880e";
        let data =
        {
          callback: "arrivalWeatherData"
        }
        darkSkyRequest(key,arrivalLat,arrivalLng,data,arrivalUnixTime);
      }
      else if (arrivalUnixTime - currentUnixTime > forecastLimit)
      {
        alert("Forecast data is unavailable if the arrival date is more than 7 days from current date. Please check again within 7 days of arrival.")
        document.getElementById("arrivalWeather").innerHTML = "Unavailable (available within 7 days of arrival date)";
      }
    }
  }

  for (let i = 0; i < newShipsArr.length; i++)
  {
    let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
    shipLS.getData(newShipsArr[i]);

    if (shipLS._shipName == selectedShip)
    {
      document.getElementById("shipRoute").innerHTML = shipLS._shipName;
      for (let i = 0; i < waypointsCoorArr.length; i++)
      {
        let wayptLng = waypointsCoorArr[i][0];
        let wayptLat = waypointsCoorArr[i][1];
        let wayptDistance = wayptDistanceArr[i];
        let shipSpeed = shipLS._shipMaxSpeed;
        let wayptTime = (wayptDistance/shipSpeed)*60*60;
        let wayptUnixTime = currentUnixTime + wayptTime;

        if (wayptUnixTime - currentUnixTime < forecastLimit)
        {
          let script = document.createElement('script');
          script.src = "https://api.darksky.net/forecast/53b2cd8a39639ff54c7c1e9ed5df880e/" + wayptLat.toFixed(4) + "," + wayptLng.toFixed(4) + "," + wayptUnixTime.toFixed(0) + "?callback=waypointWeatherData";
          document.body.appendChild(script);
        }
      }

      let selectedShipSpeed = parseInt(shipLS._shipMaxSpeed);
      let selectedShipCost = parseInt(shipLS._shipCost)
      let routeDistance = parseInt(document.getElementById("travelDistance").innerHTML);
      let routeTime = routeDistance / selectedShipSpeed;
      let routeCost = routeDistance * selectedShipCost;
      document.getElementById("travelTime").innerHTML = Math.floor((routeTime)/24) + " Days " + Math.round((routeDistance/selectedShipSpeed) % 24) + " Hours";
      document.getElementById("travelCost").innerHTML = routeCost;

      let newRouteData = getNewRouteData();
      let departDay = newRouteData.departureDate.toString();
      let departDayStr = departDay[3] + departDay[4] + "." + departDay[0] + departDay[1] + "." + departDay[6] + departDay[7] + departDay[8] + departDay[9];
      let departUnixTime = (new Date(departDayStr).getTime()/1000).toFixed(0);
      let arrivalUnixTime = currentUnixTime + Math.round(routeTime*60*60); // routeTime in seconds added to currentUnixTime
      let arrivalDate = new Date(departDayStr);
      arrivalDate.setHours(arrivalDate.getHours() + Number(routeTime));
      let arrivalDateStr = arrivalDate.getDate() + "/" + (arrivalDate.getMonth()+1) + "/" + arrivalDate.getFullYear();
      document.getElementById("arriveDate").innerHTML = arrivalDateStr;

      // Check if arrival date is within 7 days of current date
      if (arrivalUnixTime - currentUnixTime < forecastLimit)
      {
        let key = "53b2cd8a39639ff54c7c1e9ed5df880e";
        let data =
        {
          callback: "arrivalWeatherData"
        }
        darkSkyRequest(key,arrivalLat,arrivalLng,data,arrivalUnixTime);
      }
      else if (arrivalUnixTime - currentUnixTime > forecastLimit)
      {
        alert("Forecast data is unavailable if the arrival date is more than 7 days from current date. Please check again within 7 days of arrival.")
        document.getElementById("arrivalWeather").innerHTML = "Unavailable (available within 7 days of arrival date)";
      }
    }
  }
}


//function to store route data as confirmed route
function confirmRoute()
{
  let routeID = document.getElementById('routeID').innerHTML;
  let departPort = document.getElementById('departPort').innerHTML;
  let arrivalPort = document.getElementById('destiPort').innerHTML;
  let departureDate = document.getElementById('departDate').innerHTML;
  let arrivalDate = document.getElementById('arriveDate').innerHTML;
  let selectedShip = document.getElementById('ship').value;
  let travelDistance = document.getElementById('travelDistance').innerHTML;
  let departWeather = document.getElementById('departWeather').innerHTML;
  let arrivalWeather = document.getElementById('arrivalWeather').innerHTML;
  let travelTime = document.getElementById('travelTime').innerHTML;
  let travelCost = document.getElementById('travelCost').innerHTML;
  let waypoints = getWaypointsCoorArr();
  let portsAPIArr = getPortsArrAPI();
  let newPortsArr = getPortsArrAdded();
  let departPortClass = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
  for (let i = 0; i < portsAPIArr.length; i++)
  {
    if (portsAPIArr[i]._portName === departPort)
    {
      departPortClass.getData(portsAPIArr[i]);
    }
  }
  for (let i = 0; i < newPortsArr.length; i++)
  {
    if (newPortsArr[i]._portName === departPort)
    {
      departPortClass.getData(newPortsArr[i]);
    }
  }
  let arrivalPortClass = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
  for (let i = 0; i < portsAPIArr.length; i++)
  {
    if (portsAPIArr[i]._portName === arrivalPort)
    {
      arrivalPortClass.getData(portsAPIArr[i]);
    }
  }
  for (let i = 0; i < newPortsArr.length; i++)
  {
    if (newPortsArr[i]._portName === arrivalPort)
    {
      arrivalPortClass.getData(newPortsArr[i]);
    }
  }
  let shipsAPIArr = getShipsArrAPI();
  let newShipsArr = getShipsArrAdded();
  let shipClass = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
  for (let i = 0; i < shipsAPIArr.length; i++)
  {
    if (shipsAPIArr[i]._shipName === selectedShip)
    {
      shipClass.getData(shipsAPIArr[i]);
    }
  }
  for (let i = 0; i < newShipsArr.length; i++)
  {
    if (newShipsArr[i]._shipName === selectedShip)
    {
      shipClass.getData(newShipsArr[i]);
    }
  }

  let confirmRouteData = new Routes(routeID, departPortClass, arrivalPortClass, departureDate, arrivalDate , shipClass, travelDistance, departWeather, arrivalWeather, travelTime, travelCost, waypoints);

  let confirmedRoutesArr = getConfirmedRoutes()
  confirmedRoutesArr.push(confirmRouteData);
  storeConfirmedRoutes(confirmedRoutesArr);
  localStorage.removeItem(STORAGE_KEY_NEWROUTE);
  localStorage.removeItem(STORAGE_KEY_WAYPOINTS);
}
