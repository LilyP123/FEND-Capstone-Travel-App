const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const webpack = require('webpack');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static('dist'));
app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:8081'] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/username', (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.json({ username: process.env.geonames_username });
  
});

app.post('/proxy/analyze', (req, res) => {
  const { text } = req.body;
  axios.post(`http://api.geonames.org/searchJSON?username=${encodeURIComponent(process.env.geonames_username)}&q=${encodeURIComponent(req.body.city)}&country=${encodeURIComponent(req.body.country)}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Initialize an empty object to store the weather data
let projectData = {};

// Adding a GET route that returns the weather data object
app.get('/projectData', (req, res) => {
  res.send(projectData);
});

// POST route to handle weather data
app.post('/add', addData);

function addData(req, res) {
  const newEntry = {
    temperature: req.body.temperature,
    date: req.body.date,
    userResponse: req.body.userResponse,
  };

  projectData = newEntry;

  res.send(projectData);
}

app.get('/', function (req, res) {
  res.sendFile(path.resolve('dist/index.html'));
});

app.use('/proxy', createProxyMiddleware({
  target: 'http://api.geonames.org/searchJSON?',
  changeOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:8080',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}));

app.get('/proxy/APIKey', (req, res) => {
  res.json({ APIKey: process.env.APIKey });
});

app.post('/proxy/api-key', (req, res) => {
  const { text } = req.body;
  const remainingDays = 0; // Assigned a value to remainingDays

  if (remainingDays <= 0) {
    axios.post(`https://api.weatherbit.io/v2.0/current?lat=${encodeURIComponent(latitude.data)}&lon=${encodeURIComponent(longitude.data)}&key=${encodeURIComponent(process.env.APIKey)}&include=minutely`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  } else {
    axios.post(`https://api.weatherbit.io/v2.0/forecast?lat=${encodeURIComponent(latitude.data)}&lon=${encodeURIComponent(longitude.data)}&key=${encodeURIComponent(process.env.APIKey)}&include=minutely`)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  }
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
