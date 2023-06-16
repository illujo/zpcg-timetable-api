const express = require("express");
const axios = require("axios");
const { parse } = require("node-html-parser");

const app = express();

app.get("/crawl", async (req, res) => {
  try {
    const url = "https://www.zcg-prevoz.me/lokalni-red-voznje.html"; // Replace with the URL you want to crawl

    // Fetch the webpage content
    const response = await axios.get(url);
    const html = response.data;

    const parsed = parse(html, {
      removeWhitespace: true,
    });

    const schedule = [];
    const stationElements = parsed.querySelectorAll("h5");
    stationElements.forEach((stationElement) => {
      getDataFromTable(
        stationElement.innerHTML,
        stationElement.nextElementSibling
      ).forEach((row) => {
        schedule.push(row);
      });
    });
    res.send(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const port = 3000; // Change the port number if needed
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

function getDataFromTable(station, tableElement) {
  let table = [];
  let headers = [];
  const headerElements = tableElement.querySelectorAll("th");
  headerElements.forEach((headerElement) => {
    headers.push(headerElement.innerHTML);
  });
  const tableBodyElements = tableElement.querySelectorAll("tbody");
  const tableRowElements = tableBodyElements[0].querySelectorAll("tr");
  let rows = [];
  tableRowElements.forEach((tableRow) => {
    const rowCellElements = tableRow.querySelectorAll("td");
    let cellObj = {};
    cellObj.polazna_stanica = station;
    for (let i = 0, length = rowCellElements.length; i < length; i++) {
      cellObj[convertToLowerUnderscore(headers[i])] =
        rowCellElements[i].innerHTML;
    }
    delete cellObj.detalji;
    rows.push(cellObj);
  });
  return rows;
}

function convertToLowerUnderscore(str) {
  return str.replace(/ /g, "_").toLowerCase();
}
