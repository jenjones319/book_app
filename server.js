'use strict';

// Application Dependencies
const express = require('express');
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.post('/contact', (request, response) => {
  console.log(request.body);
  response.sendFile('./thanks.html', { root: './public' });
});

app.get('/contact', (request, response) => {
  console.log(request.query);
  response.sendFile('./thanks.html', { root: './public' });
});

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
