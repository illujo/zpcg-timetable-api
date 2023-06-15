const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/crawl', async (req, res) => {
  try {
    const url = 'https://www.zcg-prevoz.me/lokalni-red-voznje.html'; // Replace with the URL you want to crawl

    // Fetch the webpage content
    const response = await axios.get(url);
    const html = response.data;

    // Use cheerio to parse the HTML
    const $ = cheerio.load(html);

    // Do something with the parsed data
    // For example, extract all the links from the webpage
    const links = [];
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      links.push(link);
    });

    res.json({ html }); // Return the extracted links as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const port = 3000; // Change the port number if needed
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
