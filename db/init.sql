#TODO: get default image for book covers
# table user_bookclubs
# table checkpoints
# documentation

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    last_updated_isbn TEXT REFERENCES books(isbn),
    last_updated_club INTEGER REFERENCES bookclubs(id)
);

CREATE TABLE user_friends (
    friend1_id INTEGER REFERENCES users(id),
    friend2_id INTEGER REFERENCES users(id),
    PRIMARY KEY (friend1_id, friend2_id)
);

CREATE TABLE books (
    isbn TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image TEXT DEFAULT '../client/public/default_cover.png',
    book_length INTEGER NOT NULL
);

CREATE TABLE user_books (
    user_id REFERENCES users(id),
    book_isbn REFERENCES books(isbn),
    PRIMARY KEY (user_id, book_isbn),
    start_date DATE,
    end_date DATE,
    read_status TEXT CHECK (status IN ('to_read', 'reading', 'finished')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    is_favorite BOOLEAN
);


CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    genre_name TEXT UNIQUE NOT NULL
);

CREATE TABLE user_genres (
    user_id REFERENCES users(id),
    genre_id REFERENCES genres(id),
    PRIMARY KEY (user_id, genre_id)
);

CREATE TABLE book_genres (
    book_isbn REFERENCES books(isbn),
    genre_id REFERENCES genres(id),
    PRIMARY KEY (book_isbn, genre_id)
);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    author_name TEXT NOT NULL
);

CREATE TABLE user_authors (
    user_id REFERENCES users(id),
    author_id REFERENCES authors(id),
    PRIMARY KEY (user_id, author_id)
);

CREATE TABLE bookclubs (
    id SERIAL PRIMARY KEY,
    book_isbn TEXT REFERENCES books(isbn),
    club_name TEXT NOT NULL,
    number_members INTEGER NOT NULL,
    max_members INTEGER,
    club_description TEXT,
    public BOOLEAN
);

CREATE TABLE bookclub_members (
    user_id INTEGER REFERENCES users(id), 
    club_id INTEGER REFERENCES bookclubs(id),
    PRIMARY KEY (user_id, club_id)
);