"use strict";

// function for adding new port
function addPort()
{
  let name = document.getElementById("name").value;
  let country = document.getElementById("country").value;
  let type = document.getElementById("type").value;
  let size = document.getElementById("size").value;
  let locPrec = document.getElementById("locPrec").value;
  let lat = document.getElementById("lat").value;
  let lng = document.getElementById("lng").value;
  let newPort = new Ports(name,country,type,size,locPrec,lat,lng);
  let portsArrAdded = getPortsArrAdded();
  portsArrAdded.push(newPort);
  let optionArrAPI = getOptionsArrAPI();
  let optionArrAdded = getOptionsArrAdded();
  let found = false;
  for (let i = 0; i < optionArrAPI.length; i++)
  {
    if (newPort._portCountry == optionArrAPI[i])
    {
      found = true;
    }
  }
  for (let i = 0; i < optionArrAdded.length; i++)
  {
    if (newPort._portCountry == optionArrAdded[i])
    {
      found = true;
    }
  }
  if (found === false)
  {
    optionArrAdded.push(newPort._portCountry);
  }

  storeAddedPorts(portsArrAdded);
  storeAddedOptions(optionArrAdded);
  alert("Port has been added!");
}

//function to get latitude and longitude of new port
function findLatLng(data)
{
  let newPortLat = data.results[0].geometry.lat;
  let newPortLng = data.results[0].geometry.lng;
  let latOutput = "<option value ='" + newPortLat + "'>" + newPortLat + "</option>"
  let lngOutput = "<option value ='" + newPortLng + "'>" + newPortLng + "</option>"
  document.getElementById("lat").innerHTML = latOutput;
  document.getElementById("lng").innerHTML = lngOutput;
  document.getElementById("lat").value = newPortLat;
  document.getElementById("lng").value = newPortLng;
}

// function for getting the latitude and longitude of new port
function getLatLng()
{
  let location = document.getElementById("address").value;
  let key = "ccf98dff7f9049ac8aafc2be8c8139e8";
  let callback = "findLatLng";
  geocodeRequest(key,location,callback);
}
