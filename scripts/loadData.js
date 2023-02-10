"use strict";

function loadData()
{
  portRequest();
  shipRequest();
  getRoutes();
}

// API request for ports
function portRequest()
{
  let url = "https://eng1003.monash/api/v1/ports/"
  let data =
  {
    callback: "displayPortData"
  }
  webServiceRequest(url,data);
}

// function to get all the port data from port's API
function getAPIPortData(data)
{
  let portsArr = [];
  let countryOptionsArr = [];
  for (let i = 0; i < data.ports.length; i++)
  {
    let name = data.ports[i].name;
    let country = data.ports[i].country;
    let type = data.ports[i].type;
    let size = data.ports[i].size;
    let locprecision = data.ports[i].locprecision;
    let lat = data.ports[i].lat;
    let lng = data.ports[i].lng;
    let newPort = new Ports(name,country,type,size,locprecision,lat,lng);
    portsArr.push(newPort);
    let found = false;
    for (let i = 0; i < countryOptionsArr.length; i++)
    {
      if (newPort._portCountry == countryOptionsArr[i])
      {
        found = true;
      }
    }
    if (found === false)
    {
      countryOptionsArr.push(newPort._portCountry);
    }
  }
  storeAPIPorts(portsArr);
  storeAPIOptions(countryOptionsArr);
  alert("New port data has been added to local storage!");
}

// callback function for port's API
function displayPortData(data)
{
  let portsDataVer = getPortDataVer();
  if (portsDataVer < data.version)
  {
    getAPIPortData(data);
    portsDataVer = data.version;
    storePortVer(portsDataVer);
  }
}

// API request for ports
function shipRequest()
{
  let url = "https://eng1003.monash/api/v1/ships/"
  let data =
  {
    callback: "displayShipData"
  }
  webServiceRequest(url,data);
}

// function to get all the ship data from ship's API
function getAPIShipData(data)
{
  let shipsArr = [];
  for (let i = 0; i < data.ships.length; i++)
  {
    let name = data.ships[i].name;
    let maxSpeedKnots = data.ships[i].maxSpeed;
    let maxSpeedkmh = maxSpeedKnots*1.852;
    let range = data.ships[i].range;
    let desc = data.ships[i].desc;
    let cost = data.ships[i].cost;
    let stat = data.ships[i].status;
    let com = data.ships[i].comments;
    let newShip = new Ships(name,maxSpeedkmh.toFixed(2),range,desc,cost,stat,com);
    shipsArr.push(newShip);
  }
  storeAPIShips(shipsArr);
  alert("New Ship data has been added to local storage!")
}

// callback function for ship's API
function displayShipData(data)
{
  let shipsDataVer = getShipDataVer();
  if (shipsDataVer !== data.version)
  {
    getAPIShipData(data);
    shipsDataVer = data.version;
    storeShipVer(shipsDataVer);
  }
}

//onload function on home page to retrieve confirmed routes data
function getRoutes()
{
  let confirmedRoutes = getConfirmedRoutes();
  let routeTableOutput = "";
  let status;
  for (let i=0; i<confirmedRoutes.length; i++)
  {
    let departPort = confirmedRoutes[i]._routeFrom;
    let arrivalPort = confirmedRoutes[i]._routeTo;
    let departCountry = departPort._portCountry.toUpperCase();
    let arrivalCountry = arrivalPort._portCountry.toUpperCase();
    let status;
    let departDate = confirmedRoutes[i]._departDate;
    let departDateStr = departDate.substring(3,5) + "." + departDate.substring(0,2) + "." + departDate.substring(6,10);
    let arrivalDate = confirmedRoutes[i]._arrivalDate;
    let arrivalDateStr = arrivalDate.substring(3,5) + "." + arrivalDate.substring(0,2) + "." + arrivalDate.substring(6,10);
    let departUnixTime = (new Date(departDateStr).getTime()/1000).toFixed(0);
    let arrivalUnixTime = (new Date(arrivalDateStr).getTime()/1000).toFixed(0);

    if (currentUnixTime > departUnixTime)
    {
      if (currentUnixTime > arrivalUnixTime)
      {
        status = "Historical";
      }
      else if (currentUnixTime < arrivalUnixTime)
      {
        status = "Current";
      }
    }
    if (currentUnixTime < departUnixTime)
    {
      status = "Scheduled";
    }
    routeTableOutput += "<tr><td class='mdl-data-table__cell--non-numeric'>" + confirmedRoutes[i]._routeID + "</td>";
    routeTableOutput += "<td>" + status + "</td>"
    routeTableOutput += "<td class='mdl-data-table__cell--non-numeric'>" + departPort._portName + ", " + departCountry + "</td>";
    routeTableOutput += "<td class='mdl-data-table__cell--non-numeric'>" + arrivalPort._portName +  ", " + arrivalCountry + "</td>";
    routeTableOutput += "<td class='mdl-data-table__cell--non-numeric'>" + confirmedRoutes[i]._departDate + "</td>";
    routeTableOutput += "<td><button onclick='window.location.href=\"confirmedRouteView.html\";storeRouteIndex("+i+")' class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect'><b>View</b></button></td>"
    routeTableOutput += "<td><button onclick='deleteRoute("+i+")' class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect'><b>Delete</b></button></td></tr>";
  }

  document.getElementById("routeTableOutput").innerHTML = routeTableOutput;
}

//function to store route index to access at confirmedRouteView
function storeRouteIndex(index)
{
  localStorage.setItem("routeIndex",JSON.stringify(index));
}

//function to delete certain route
function deleteRoute(i)
{
  let confirmedRoutes = getConfirmedRoutes();
  confirmedRoutes.splice(i,1);
  storeConfirmedRoutes(confirmedRoutes)
  location.reload();
}

function onReady(callback) {
  var intervalId = window.setInterval(function() {
    if (document.getElementsByTagName('body')[0] !== undefined) {
      window.clearInterval(intervalId);
      callback.call(this);
    }
  }, 1000);
}

function setVisible(selector, visible) {
  document.querySelector(selector).style.display = visible ?'block' : 'none';
}

onReady(function() {
  setVisible('#homeBody', true);
  setVisible('#loading', false);
});
