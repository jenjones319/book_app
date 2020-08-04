'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.urlencoded({ extended: true }));


// Set the view engine for server-side templating
app.set('view engine', 'ejs');

app.use(express.static('./public'));

// API Routes
// Renders the home page
app.get('/', renderHomePage);

// Renders the search form
app.get('/new', showForm);

// Creates a new search to the Google Books API
app.post('/searches', createSearch);

// Catch-all
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// HELPER FUNCTIONS
function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.image_url = info.imageLinks.thumbnail || placeholderImage;
  this.title = info.title || 'No title available';
  this.authors = info.authors || 'No authors available';
  this.description = info.description || 'No description availble'
}

// Note that .ejs file extension is not required

function renderHomePage(request, response) {
  response.render('pages/index');
}

function showForm(request, response) {
  response.render('pages/new.ejs');
}

function errorHandler(error, request, response, next) {
  response.status(500).json({ error: true, message: error.message });
}

// No API key required
// Console.log request.body and request.body.search
function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  console.log(request.body);
  console.log(request.body.search);

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'authors') { url += `+inauthors:${request.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/show', { searchResults: results }));

  // how will we handle errors?
//added an error handler function on ln 52
}
