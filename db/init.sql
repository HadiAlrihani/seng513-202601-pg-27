CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    user_password TEXT NOT NULL
);

CREATE TABLE books(
    isbn TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL
);

CREATE TABLE bookclubs (
    id SERIAL PRIMARY KEY,
    club_name TEXT NOT NULL,
    number_members INTEGER NOT NULL,
    book_id TEXT REFERENCES books(isbn)
);

CREATE TABLE bookclub_members(
    user_id INTEGER REFERENCES users(id),
    club_id INTEGER REFERENCES bookclubs(id),
    PRIMARY KEY (user_id, club_id)
);