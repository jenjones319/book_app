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
app.get('/searches/new', showForm);
app.get('/new', showForm);
app.get('/books/:id', getBook);
app.post('/savebook', saveBook)


// Creates a new search to the Google Books API
app.post('/searches', createSearch);

// Catch-all
app.get('*', (request, response) => response.status(404).send('This route does not exist'));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// HELPER FUNCTIONS
function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.image_url = info.imageLinks ? info.imageLinks.thumbnail : placeholderImage;
  this.title = info.title ? info.title : 'No title available';
  this.authors = info.authors ? info.authors.join(', ') : 'No authors available';
  this.description = info.description ? info.description : 'No description availble';
  this.isbn = info.industryIdentifiers ? info.industryIdentifiers.map(i => i.identifier).join(', ').toString() : 'No ISBN availble';
  this.bookShelf = info.categories ? info.categories : 'Bookshelf not found';
}

function renderHomePage(request, response) {
  response.render('pages/index');
}

function showForm(request, response) {
  response.render('pages/new.ejs');
}

function getBook(request, response) {
  const SQL = `
    SELECT *
    FROM bookshelf 
    WHERE id = $1;
    `;

  let values = [request.params.id];
  clientInformation.query(SQL, values)
    .then(result => {
      let viewModel = {
        bookshelf: result.rows[0]
      };
      response.render('pages/detail', viewModel);
    })
    .catch(error => errorHandler(error, response));
}

function saveBook(request, response) {
  let { ibsn, image_url, title, author, descriptions, category } = request.body;
  const SQL = `
    INSERT INTO bookshelf (ibsn, image_url, title, author, descriptions, category)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;
  const values = [ibsn, image_url, title, author, descriptions, category];
  clientInformation.query(SQL, values)
  .then(result => {
    response.redirect('/')
  })
  .catch(error => errorHandler(error, response));
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
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }

  superagent.get(url)
    .then(apiResponse => apiResponse.body.items.map(viewDetails => new View(viewDetails.volumeInfo)))
    .then(results => response.render('pages/show', { viewDetails: results }))
    .catch(err => {
      errorHandler(err, response)
    });
}

