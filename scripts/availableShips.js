"use strict";
getShipTable();

// function to generate the table for ships
function generateShipTable(ships, shipIndex)
{
  let outputHTML = "";
  outputHTML += "<tr><td class='mdl-data-table__cell--non-numeric'>" + ships._shipName + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ships._shipMaxSpeed + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ships._shipRange + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ships._shipDescription + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ships._shipCost + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ships._shipStatus + "</td>";
  return outputHTML;
}

function getShipTable()
{
  let outputHTMLref = document.getElementById('shipTable');
  let outputHTML = "";
  let shipsArrAPI = getShipsArrAPI();
  for (let i = 0; i < shipsArrAPI.length; i++)
  {
    let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
    shipLS.getData(shipsArrAPI[i]);
    outputHTML += generateShipTable(shipLS, i) //i as shipIndex
  }
  let shipsArrAdded = getShipsArrAdded();
  for (let i = 0; i < shipsArrAdded.length; i++)
  {
    let shipLS = new Ships("FIT","FIT","FIT","FIT","FIT","FIT","FIT")
    shipLS.getData(shipsArrAdded[i]);
    outputHTML += generateShipTable(shipLS, i) //i as shipIndex
  }
  outputHTMLref.innerHTML = outputHTML;
}
