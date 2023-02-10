"use strict";

// function for adding new ship
function addShip()
{
  let name = document.getElementById("name").value;
  let maxSpeedKnots = document.getElementById("maxSpeed").value;
  let maxSpeedkmh = maxSpeedKnots*1.852;
  let range = document.getElementById("range").value;
  let desc = document.getElementById("desc").value;
  let cost = document.getElementById("cost").value;
  let stat = document.getElementById("stat").value;
  let com = document.getElementById("com").value;
  let newShip = new Ships(name,maxSpeedkmh.toFixed(2),range,desc,cost,stat,com);
  let addedShipsArr = getShipsArrAdded();
  addedShipsArr.push(newShip);
  storeAddedShips(addedShipsArr);
  alert("Ship has been added!");
}
