"use strict";

// Global Variables and constants
var portsAPIArr, newPortsArr, countryOptionsArr, newCountryOptionsArr;
var shipsAPIArr, newShipsArr;
var portsDataVer, shipsDataVer;
var confirmedRoutesArr;
let currentUnixTime = parseInt((new Date().getTime()/1000).toFixed(0));
let forecastLimit = 7*24*60*60; // forecast limit (7 days) in seconds


// Ports Class
class Ports
{
  constructor(portName,portCountry,portType,portSize,portLocprecision,portLat,portLng)
  {
    this._portName = portName;
    this._portCountry = portCountry;
    this._portType = portType;
    this.portSize = portSize;
    this._portLocprecision = portLocprecision;
    this._portLat = portLat;
    this._portLng = portLng;
  }

  get portName(){return this._portName;}
  get portCountry(){return this._portCountry;}
  get portType(){return this._portType;}
  get portSize(){return this._portSize;}
  get portLocprecision(){return this._portLocprecision;}
  get portLat(){return this._portLat;}
  get portLng(){return this._portLng;}
  set portName(newPortName){this._portName = newPortName;}
  set portCountry(newPortCountry){this._portCountry = newPortCountry;}
  set portType(newPortType){this._portType = newPortType;}
  set portSize(newPortSize){this._portSize = newPortSize;}
  set portLocprecision(newPortLocprecision){this._portLocprecision = newPortLocprecision;}
  set portLat(newPortLat){this._portLat = newPortLat;}
  set portLng(newPortLng){this._portLng = newPortLng;}

  getData(object)
  {
    this._portName = object._portName;
    this._portCountry = object._portCountry;
    this._portType = object._portType;
    this._portSize = object._portSize;
    this._portLocprecision = object._portLocprecision;
    this._portLat = object._portLat;
    this._portLng = object._portLng;
  }
}

// Ships Class
class Ships
{
  // constructor for ship class
  constructor(shipName, shipMaxSpeed, shipRange, shipDescription, shipCost, shipStatus, shipComments)
  {
    this._shipName = shipName;
    this._shipMaxSpeed = shipMaxSpeed;
    this._shipRange = shipRange;
    this._shipDescription = shipDescription;
    this._shipCost = shipCost;
    this._shipStatus = shipStatus;
    this._shipComments = shipComments;
  }
  // Accessors and mutators for the "ship" class
  get shipName(){return this._shipName;}
  get shipMaxSpeed(){return this._shipMaxSpeed;}
  get shipRange(){return this._shipRange;}
  get shipDescription(){return this._shipDescription;}
  get shipCost(){return this._shipCost;}
  get shipStatus(){return this._shipStatus;}
  get shipComments(){return this._shipComments;}
  set shipName(newShipName){this._shipName = newShipName;}
  set shipMaxSpeed(newShipMaxSpeed){this._shipMaxSpeed = newShipMaxSpeed;}
  set shipRange(newShipRange){this._shipRange = newShipRange;}
  set shipDescription(newShipDescription){this._shipDescription = newShipDescription;}
  set shipCost(newShipCost){this._shipCost = newShipCost;}
  set shipStatus(newShipStatus){this._shipStatus = newShipStatus;}
  set shipComments(newShipComments){this._shipComments = newShipComments;}

  getData(object)
  {
    this._shipName = object._shipName;
    this._shipMaxSpeed = object._shipMaxSpeed;
    this._shipRange = object._shipRange;
    this._shipDescription = object._shipDescription;
    this._shipCost = object._shipCost;
    this._shipStatus = object._shipStatus;
    this._shipComments = object._shipComments;
  }
}

// Routes Class
class Routes
{
	constructor(routeID, routeFrom, routeTo, departDate, arrivalDate, ship, travelDistance, departWeather, arrivalWeather, travelTime, cost, waypoints)
	{
    this._routeID = routeID;
		this._routeFrom = routeFrom;
		this._routeTo = routeTo;
		this._departDate = departDate;
    this._arrivalDate = arrivalDate;
		this._ship = ship;
    this._travelDistance = travelDistance;
		this._departWeather = departWeather;
    this._arrivalWeather = arrivalWeather;
		this._travelTime = travelTime;
		this._cost = cost;
		this._waypoints = waypoints;
	}

  get routeID(){return this._routeID}
  get routeFrom(){return this._routeFrom;}
  get routeTo(){return this._routeTo;}
  get departDate(){return this._departDate;}
  get arrivalDate(){return this._arrivalDate;}
  get ship(){return this._ship;}
  get travelDistance(){return this._travelDistance}
  get departWeather(){return this._departWeather;}
  get arrivalWeather(){return this._arrivalWeather;}
  get travelTime(){return this._travelTime;}
  get cost(){return this._cost;}
  get waypoints(){return this._waypoints;}

  getData(object)
  {
    this._routeID = object._routeID;
    this._routeFrom = object._routeFrom;
    this._routeTo = object._routeTo;
    this._departDate = object._departDate;
    this._arrivalDate = object._arrivalDate;
    this._ship = object._ship;
    this._travelDistance = object._travelDistance;
    this._departWeather = object._departWeather;
    this._arrivalWeather = object._arrivalWeather;
    this._travelTime = object._travelTime;
    this._cost = object._cost;
    this._waypoints = object.waypoints;
  }
}

// Global code for local storage
const STORAGE_KEY1 = "PORTS";
const STORAGE_KEY2 = "COUNTRYOPTIONS";
const STORAGE_KEY3 = "ADDEDPORTS"
const STORAGE_KEY4 = "ADDEDCOUNTRYOPTIONS";
const STORAGE_KEY5 = "SHIPS";
const STORAGE_KEY6 = "ADDEDSHIPS";
const STORAGE_KEY_VERP = "DATAVERPORTS";
const STORAGE_KEY_VERS = "DATAVERSHIPS";
const STORAGE_KEY_NEWROUTE = "NEWROUTEDATA";
const STORAGE_KEY_WAYPOINTS = "waypointsCoorArr";
const STORAGE_KEY_CONFIRMEDROUTE = "confirmedRoutes";

function getPortDataVer()
{
  let portsDataVer = JSON.parse(localStorage.getItem(STORAGE_KEY_VERP));
  if (portsDataVer === null)
  {
    portsDataVer = 0;
  }
  return portsDataVer;
}

function storePortVer(dataVer)
{
  if (typeof(Storage) !== "undefined")
  {
    let verJSON = JSON.stringify(dataVer);
    localStorage.setItem(STORAGE_KEY_VERP,verJSON);
  }
  else
  {
    alert('Your Browser does not support local storage!');
  }
}

function getShipDataVer()
{
  let shipsDataVer = JSON.parse(localStorage.getItem(STORAGE_KEY_VERS));
  if (shipsDataVer === null)
  {
    shipsDataVer = 0;
  }
  return shipsDataVer;
}

function storeShipVer(dataVer)
{
  if (typeof(Storage) !== "undefined")
  {
    let verJSON = JSON.stringify(dataVer);
    localStorage.setItem(STORAGE_KEY_VERS,verJSON);
  }
  else
  {
    alert('Your Browser does not support local storage!');
  }
}

function getPortsArrAPI()
{
  let portsAPIArr = JSON.parse(localStorage.getItem(STORAGE_KEY1));
  if (portsAPIArr === null)
  {
    portsAPIArr = [];
  }
  return portsAPIArr;
}

function storeAPIPorts(portArrAPI)
{
  if(typeof(Storage) !== "undefined")
  {
    let portsJSON = JSON.stringify(portArrAPI);
    localStorage.setItem(STORAGE_KEY1,portsJSON);
  }
  else
  {
    alert("Your Browser does not support local storage!");
  }
}

function getPortsArrAdded()
{
  let newPortsArr = JSON.parse(localStorage.getItem(STORAGE_KEY3));
  if (newPortsArr === null)
  {
    newPortsArr = [];
  }
  return newPortsArr;
}

function storeAddedPorts(portArrAdded)
{
  if(typeof(Storage) !== "undefined")
  {
    let portsJSON = JSON.stringify(portArrAdded);
    localStorage.setItem(STORAGE_KEY3,portsJSON);
  }
  else
  {
    alert("Your Browser does not support local storage!");
  }
}

function getOptionsArrAPI()
{
  let countryOptionsArr = JSON.parse(localStorage.getItem(STORAGE_KEY2));
  if (countryOptionsArr === null)
  {
    countryOptionsArr = [];
  }
  return countryOptionsArr;
}

function storeAPIOptions(optionArrAPI)
{
  if(typeof(Storage) !== "undefined")
  {
    let countryOptionsJSON = JSON.stringify(optionArrAPI);
    localStorage.setItem(STORAGE_KEY2,countryOptionsJSON);
  }
  else
  {
    alert("Your Browser does not support local storage!");
  }
}

function getOptionsArrAdded()
{
  let newCountryOptionsArr = JSON.parse(localStorage.getItem(STORAGE_KEY4));
  if (newCountryOptionsArr === null)
  {
    newCountryOptionsArr = [];
  }
  return newCountryOptionsArr;
}

function storeAddedOptions(optionArrAdded)
{
  if(typeof(Storage) !== "undefined")
  {
    let countryOptionsJSON = JSON.stringify(optionArrAdded);
    localStorage.setItem(STORAGE_KEY4,countryOptionsJSON);
  }
  else
  {
    alert("Your Browser does not support local storage!");
  }
}

function getShipsArrAPI()
{
  let shipsAPIArr = JSON.parse(localStorage.getItem(STORAGE_KEY5));
  if (shipsAPIArr === null)
  {
    shipsAPIArr = [];
  }
  return shipsAPIArr;
}

function storeAPIShips(shipsArrAPI)
{
  if(typeof(Storage) !== "undefined")
  {
    let shipsJSON = JSON.stringify(shipsArrAPI);
    localStorage.setItem(STORAGE_KEY5,shipsJSON);
  }
  else
  {
    alert("Your Browser does not support local storage!");
  }
}

function getShipsArrAdded()
{
  let newShipsArr = JSON.parse(localStorage.getItem(STORAGE_KEY6));
  if (newShipsArr === null)
  {
    newShipsArr = [];
  }
  return newShipsArr;
}

function storeAddedShips(shipArrAdded)
{
  if(typeof(Storage) !== "undefined")
  {
    let shipsJSON = JSON.stringify(shipArrAdded);
    localStorage.setItem(STORAGE_KEY6,shipsJSON);
  }
  else
  {
    alert("Your Browser does not support local storage!");
  }
}

function getConfirmedRoutes()
{
  let confirmedRoutesArr = JSON.parse(localStorage.getItem(STORAGE_KEY_CONFIRMEDROUTE));
  if (confirmedRoutesArr === null)
  {
    confirmedRoutesArr = [];
  }
  return confirmedRoutesArr;
}

function storeConfirmedRoutes(confirmedRoutesArr)
{
  if(typeof(Storage) !== "undefined")
  {
    let routeJSON = JSON.stringify(confirmedRoutesArr);
    localStorage.setItem(STORAGE_KEY_CONFIRMEDROUTE,routeJSON);
  }
  else
  {
    alert("Your Browser does not support local storage!");
  }
}

function getNewRouteData()
{
  let newRouteData = JSON.parse(localStorage.getItem(STORAGE_KEY_NEWROUTE));
  return newRouteData;
}

function storeNewRouteData(newRouteData)
{
  if (typeof(Storage) !== "undefined")
  {
    let newRouteJSON = JSON.stringify(newRouteData);
    localStorage.setItem(STORAGE_KEY_NEWROUTE,newRouteJSON);
  }
  else
  {
    alert("Your browser does not support local storage!");
  }
}

function getWaypointsCoorArr()
{
  let waypointsCoorArr = JSON.parse(localStorage.getItem(STORAGE_KEY_WAYPOINTS));
  if (waypointsCoorArr === null)
  {
    waypointsCoorArr = [];
  }
  return waypointsCoorArr;
}

function storeWaypointsCoorArr(waypointsCoorArr)
{
  if (typeof(Storage) !== "undefined")
  {
    let waypointJSON = JSON.stringify(waypointsCoorArr);
    localStorage.setItem(STORAGE_KEY_WAYPOINTS,waypointJSON);
  }
  else
  {
    alert("Your browser does not support local storage!");
  }
}

function webServiceRequest(url,data)
{
  // Build URL parameters from data object.
  let params = "";
  // For each key in data object...
  for (let key in data)
  {
    if (data.hasOwnProperty(key))
    {
      if (params.length == 0)
      {
        // First parameter starts with '?'
        params += "?";
      }
      else
      {
        // Subsequent parameter separated by '&'
        params += "&";
      }

      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(data[key]);

      params += encodedKey + "=" + encodedValue;
    }
  }
  let script = document.createElement('script');
  script.src = url + params;
  document.body.appendChild(script);
}

function geocodeRequest(key, address, callback)
{
  let script = document.createElement('script');
  script.src = "https://api.opencagedata.com/geocode/v1/json?q=" + encodeURIComponent(address) + "&key=" + key + "&jsonp=" + callback;
  document.body.appendChild(script);
}

function darkSkyRequest(key,lat,lng,data,time)
{
  // Build URL parameters from data object.
  let params = "";
  // For each key in data object...
  for (let key in data)
  {
    if (data.hasOwnProperty(key))
    {
      if (params.length == 0)
      {
        // First parameter starts with '?'
        params += "?";
      }
      else
      {
        // Subsequent parameter separated by '&'
        params += "&";
      }

      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(data[key]);

      params += encodedKey + "=" + encodedValue;
    }
  }
  let script = document.createElement('script');
  if (time == undefined)
  {
    script.src = "https://api.darksky.net/forecast/"+key+"/"+lat+","+lng+ params;
  }
  else
  {
    script.src = "https://api.darksky.net/forecast/"+key+"/"+lat+","+lng+","+time+ params;
  }

  document.body.appendChild(script);
}
