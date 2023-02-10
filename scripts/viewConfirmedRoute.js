// Map Area
mapboxgl.accessToken = 'pk.eyJ1IjoiamxlZTAxMDAiLCJhIjoiY2swYnZ6c2JjMHl4cDNtcGxuaGRkanMybyJ9.fM36Y4-CMbfoGbJ-8CgrMg';
var map = new mapboxgl.Map({
  container: 'mapArea', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [90, 10], // starting position [lng, lat]
  zoom: 1 // starting zoom
});

let waypoints = []; //global

function loadRouteData()
{
  let route, i;
  if (typeof(Storage) !== "undefined")
  {
    i = JSON.parse(localStorage.getItem("routeIndex")); //route index
    route = JSON.parse(localStorage.getItem("confirmedRoutes"));
  }
  else
  {
    console.log("localStorage is not supported by current browser.");
  }

  document.getElementById("routeID").innerHTML = route[i]._routeID;
  document.getElementById("departPort").innerHTML = route[i]._routeFrom._portName + ", " + route[i]._routeFrom._portCountry.toUpperCase();
  document.getElementById("destiPort").innerHTML = route[i]._routeTo._portName + ", " + route[i]._routeTo._portCountry.toUpperCase();
  document.getElementById("departDate").innerHTML = route[i]._departDate;
  document.getElementById("arriveDate").innerHTML = route[i]._arrivalDate;
  document.getElementById("selectedShip").innerHTML = route[i]._ship._shipName;
  document.getElementById("travelDistance").innerHTML = route[i]._travelDistance;
  document.getElementById("departWeather").innerHTML = route[i]._departWeather;
  document.getElementById("arrivalWeather").innerHTML = route[i]._arrivalWeather;
  document.getElementById("travelTime").innerHTML = route[i]._travelTime;
  document.getElementById("travelCost").innerHTML = route[i]._cost;

  waypoints = route[i]._waypoints;
  let departPort = route[i]._routeFrom;
  let departPortCoor = [departPort._portLng, departPort._portLat];
  let coorArr = [departPortCoor];
  for (let a=0; a<waypoints.length; a++)
  {
    coorArr.push(waypoints[a]);
  }

  let distance = 0;
  let wayptDistanceArr = [];

  for (let i=0; i< coorArr.length-1; i++)
  {
    const R = 6371; // kilometres
    let portALat = coorArr[i][1]*(Math.PI/180); //latitudes
    let portBLat = coorArr[i+1][1]*(Math.PI/180);
    let latDiff = (coorArr[i+1][1] - coorArr[i][1])*(Math.PI/180);
    let lngDiff = (coorArr[i+1][0] - coorArr[i][0])*(Math.PI/180); //longtitudes

    var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
            Math.cos(portALat) * Math.cos(portBLat) *
            Math.sin(lngDiff/2) * Math.sin(lngDiff/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    distance += R * c;
    wayptDistanceArr.push(distance);

  }

  let shipSpeed = route[i]._ship._shipMaxSpeed;
  let currentUnixTime = parseInt((new Date().getTime()/1000).toFixed(0));
  let forecastLimit = 7*24*60*60; // forecast limit (7 days) in seconds

      for (let i = 0; i < waypoints.length; i++)
      {
        let wayptLng = waypoints[i][0];
        let wayptLat = waypoints[i][1];
        let wayptDistance = wayptDistanceArr[i];
        let wayptTime = parseInt((wayptDistance/shipSpeed)*60*60);
        let wayptUnixTime = currentUnixTime + wayptTime;


        if ((wayptUnixTime - currentUnixTime) < forecastLimit)
        {
          let script = document.createElement('script');
          script.src = "https://api.darksky.net/forecast/53b2cd8a39639ff54c7c1e9ed5df880e/" + wayptLat.toFixed(4) + "," + wayptLng.toFixed(4) + "," + wayptUnixTime.toFixed(0) + "?callback=waypointWeatherData";
          document.body.appendChild(script);
        }
      }

  let waypointOutput = "";
  for (let a=0; a<waypoints.length; a++)
  {
    waypointOutput += "<tr><td class='mdl-data-table__cell--non-numeric'>"+(a+1)+"</td>";
    waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>[" + waypoints[a][0].toFixed(3) + ", " + waypoints[a][1].toFixed(3) + "]</td>";
    waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>"+""+"</td>";
  }
  document.getElementById("waypointOutput").innerHTML = waypointOutput;

  let dateTemp = route[i]._departDate;
  let minDate = dateTemp.substring(6,11) + "-" + dateTemp.substring(3,5) + "-" + (parseInt(dateTemp.substring(0,2))-1);
  document.getElementById("postponeDate").min = minDate;

  //map
  let marker1 = new mapboxgl.Marker({ "color": "#F7455D" });
  let popup1 = new mapboxgl.Popup({closeOnClick: false, closeButton: false})
  popup1.setHTML("Depart From: " + departPort._portName);
  marker1.setLngLat(departPortCoor);
  marker1.setPopup(popup1);
  marker1.addTo(map);
  popup1.addTo(map);

  let arrivePort = route[i]._routeTo;
  let arrivalPortCoor = [arrivePort._portLng, arrivePort._portLat];
  let marker2 = new mapboxgl.Marker({ "color": "#F7455D" });
  let popup2 = new mapboxgl.Popup({closeOnClick: false, closeButton: false})
  popup2.setHTML("Arrive At: " + arrivePort._portName);
  marker2.setLngLat(arrivalPortCoor);
  marker2.setPopup(popup2);
  marker2.addTo(map);
  popup2.addTo(map);

  map.fitBounds([departPortCoor, arrivalPortCoor], {
    padding: 100
  });

  let linesCoorArr = [departPortCoor];
  for (let a=0; a<waypoints.length; a++)
  {
    linesCoorArr.push(waypoints[a]);
  }
  linesCoorArr.push(arrivalPortCoor);

  let waypointsCoorArr = route[i]._waypoints;

  map.on("load",function(){
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
  })
} //end of onload function

function waypointWeatherData(waypointWeatherData)
{
  let route, i;
  if (typeof(Storage) !== "undefined")
  {
    i = JSON.parse(localStorage.getItem("routeIndex")); //route index
    route = JSON.parse(localStorage.getItem("confirmedRoutes"));
  }
  else
  {
    console.log("localStorage is not supported by current browser.");
  }

  waypoints = route[i]._waypoints;

  document.getElementById("waypointOutput").innerHTML = "";

  let weatherTempArr = [];
  let waypointWeather = waypointWeatherData.currently.summary;
  let waypointTemp = (((waypointWeatherData.currently.temperature)-32)*5/9).toFixed(0) + "&#8451";
  let weatherTempStr =  waypointWeather + " (" + waypointTemp + ") ";
  weatherTempArr.push(weatherTempStr);

  if (waypointWeatherData !== null)
  {
    for (let i=0; i < waypoints.length; i++)
    {
      if (weatherTempArr[i] !== undefined)
      {
        let waypointOutput = "<tr><td class='mdl-data-table__cell--non-numeric'>"+(i+1)+"</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>[" + waypoints[i][0].toFixed(3) + ", " + waypoints[i][1].toFixed(3) + "]</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>" + weatherTempArr[i] + "</td></tr>";

        document.getElementById("waypointOutput").innerHTML += waypointOutput;
      }
      else if (weatherTempArr[i] == undefined)
      {
        let waypointOutput = "<tr><td class='mdl-data-table__cell--non-numeric'>"+(i+1)+"</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>[" + waypoints[i][0].toFixed(3) + ", " + waypoints[i][1].toFixed(3) + "]</td>";
        waypointOutput += "<td class='mdl-data-table__cell--non-numeric'>Unavailable</td></tr>";

        document.getElementById("waypointOutput").innerHTML += waypointOutput;
      }
    }
  }
}


var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#show-dialog');
if (! dialog.showModal) {
 dialogPolyfill.registerDialog(dialog);
}

showDialogButton.addEventListener('click', function() {
 dialog.showModal();
});

dialog.querySelector('.close').addEventListener('click', function() {
 dialog.close();
});


let cancelButton = document.getElementById('closeDialog');
// back button closes the dialog box
cancelButton.addEventListener('click', function() {
  dialog.close();
  openCheck(dialog);
});

function postpone()
{
  let route;
  let dateTemp = document.getElementById("postponeDate").value;
  let postponeDate = dateTemp.substring(8,10) + "." + dateTemp.substring(5,7) + "." + dateTemp.substring(0,4);
  let i = JSON.parse(localStorage.getItem("routeIndex"));
  route = getConfirmedRoutes();
  route[i]._departDate = postponeDate;
  let newDepartUnix = parseInt(((new Date(postponeDate).getTime())/1000).toFixed(0));
  let currentUnixTime = parseInt(((new Date().getTime())/1000).toFixed(0));
  let departPortLng = route[i]._routeFrom._portLng;
  let departPortLat = route[i]._routeFrom._portLat;
  if ((newDepartUnix - currentUnixTime) < forecastLimit)
  {
    let script = document.createElement('script');
    script.src = "https://api.darksky.net/forecast/53b2cd8a39639ff54c7c1e9ed5df880e/" + departPortLat.toFixed(4) + "," + departPortLng.toFixed(4) + "," + newDepartUnix.toFixed(0) + "?callback=departWeatherData";
    document.body.appendChild(script);
  }
  else if (newDepartUnix - currentUnixTime > forecastLimit)
  {
    alert("Forecast data is unavailable if the departure date is more than 7 days from current date. Please check again within 7 days of departure.");
    document.getElementById("departWeather").innerHTML = "Unavailable (available within 7 days of departure date)";
  }

  let shipSpeed = route[i]._ship._shipMaxSpeed;
  let routeDistance = route[i]._travelDistance;
  let newArrivalUnix = (routeDistance/shipSpeed)*60*60;

  let arrivalPortLng = route[i]._routeTo._portLng;
  let arrivalPortLat = route[i]._routeTo._portLat;

  if ((newArrivalUnix - currentUnixTime) < forecastLimit)
  {
    let script = document.createElement('script');
   script.src = "https://api.darksky.net/forecast/53b2cd8a39639ff54c7c1e9ed5df880e/" + arrivalPortLat.toFixed(4) + "," + arrivalPortLng.toFixed(4) + "," + newArrivalUnix.toFixed(0) + "?callback=arrivalWeatherData";
   document.body.appendChild(script);
 }
 else if (newDepartUnix - currentUnixTime > forecastLimit)
 {
   alert("Forecast data is unavailable if the departure date is more than 7 days from current date. Please check again within 7 days of departure.");
   document.getElementById("departWeather").innerHTML = "Unavailable (available within 7 days of departure date)";
 }

 route[i]._departWeather = document.getElementById('departWeather').innerHTML;
 route[i]._arrivalWeather = document.getElementById('arrivalWeather').innerHTML;
 localStorage.setItem("confirmedRoutes", JSON.stringify(route));
 location.reload();
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
