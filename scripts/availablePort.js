"use strict";
getCountryOptions();

// function for generating the table for ports
function generatePortTable(ports, portIndex)
{
  let outputHTML = "";
  outputHTML += "<tr><td class='mdl-data-table__cell--non-numeric'>" + ports._portName + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ports._portCountry + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ports._portType + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ports._portSize + "</td>";
  outputHTML += "<td class='mdl-data-table__cell--non-numeric'>" + ports._portLocprecision + "</td>";
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
function getCountryOptions()
{
  let outputHTMLref = document.getElementById("countrySearch");
  let outputHTML = "<option>Select a country</option>";
  let optionArrAPI = getOptionsArrAPI();
  let optionArrAdded = getOptionsArrAdded();
  outputHTML += generateCountryOptions(optionArrAPI,optionArrAdded);
  outputHTMLref.innerHTML = outputHTML;
}

// function to get the port data of the selected country
function getPorts()
{
  let chosenCountry = document.getElementById('countrySearch').value;
  let outputHTMLref = document.getElementById('portTable');
  let outputHTML = "";
  let portsArrAPI = getPortsArrAPI();
  for (let i = 0; i < portsArrAPI.length; i++)
  {
    let portLS = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
    portLS.getData(portsArrAPI[i]);
    if (portLS._portCountry == chosenCountry)
    {
      outputHTML += generatePortTable(portLS, i); //i as portIndex
    }
  }
  let portsArrAdded = getPortsArrAdded();
  for (let i = 0; i < portsArrAdded.length; i++)
  {
    let portLS = new Ports("FIT","FIT","FIT","FIT","FIT","FIT","FIT");
    portLS.getData(portsArrAdded[i]);
    if (portLS._portCountry == chosenCountry)
    {
      outputHTML += generatePortTable(portLS, i); //i as portIndex
    }
  }
  outputHTMLref.innerHTML = outputHTML;
}
