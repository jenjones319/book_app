CREATE TABLE IF NOT EXISTS bookshelf (
    id SERIAL PRIMARY KEY, 
    isbn VARCHAR (100),
    image_url VARCHAR (500),
    title VARCHAR (500),
    author VARCHAR (500),
    descriptions VARCHAR (500),
    category VARCHAR (500)
);