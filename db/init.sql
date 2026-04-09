/*
Schema of the Wormly Connected database. Handles relationships between
users and books, authors, genres, bookclubs, checkpoints, and discussions.
*/

-- DROP TABLES TO SAFELY RECREATE SCHEMA
DROP TABLE IF EXISTS checkpoint_messages CASCADE;
DROP TABLE IF EXISTS bookclub_members CASCADE;
DROP TABLE IF EXISTS checkpoints CASCADE;
DROP TABLE IF EXISTS user_authors CASCADE;
DROP TABLE IF EXISTS book_genres CASCADE;
DROP TABLE IF EXISTS user_genres CASCADE;
DROP TABLE IF EXISTS user_books CASCADE;
DROP TABLE IF EXISTS user_friends CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS bookclubs CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,

    --ISBN-13 is only used on books post 2007, so both are stored if available
    isbn_10 TEXT UNIQUE,
    isbn_13 TEXT UNIQUE,
    google_books_id TEXT UNIQUE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image TEXT,
    book_length INTEGER NOT NULL DEFAULT 0,
    book_description TEXT
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    genre_name TEXT UNIQUE NOT NULL
);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    author_name TEXT NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,

    --These two keep track of last interacted with book/club for quick user access
    last_updated_id INTEGER REFERENCES books(id),
    last_updated_club INTEGER 
);


CREATE TABLE bookclubs (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    created_by INTEGER REFERENCES users(id),
    book_title TEXT NOT NULL,
    club_name TEXT NOT NULL,

    --lookup code for private book clubs
    club_code TEXT UNIQUE,
    number_members INTEGER NOT NULL,
    max_members INTEGER NOT NULL,
    club_description TEXT,

    --boolean flagging whether the club is public or private
    visibility TEXT NOT NULL CHECK (visibility in ('public', 'private'))
);


CREATE TABLE user_friends (
    friend1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    friend2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (friend1_id, friend2_id)
);

--Associates users with books (many-to-many relationship)
CREATE TABLE user_books (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, book_id),
    date_started DATE,
    date_finished DATE,
    read_status TEXT CHECK (read_status IN ('to_read', 'reading', 'finished')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    reviewed_at TIMESTAMP,

    --whether a user has this book as one of their favorites
    is_favorite BOOLEAN default FALSE
);

--Users can associate themselves with genres they like
CREATE TABLE user_genres (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, genre_id)
);

--Associates books with genres (many-to-many relationship)
CREATE TABLE book_genres (
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, genre_id)
);

--Associates users with authors they want to follow (many-to-many relationship)
CREATE TABLE user_authors (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, author_id)
);

--each entry is a checkpoint/thread in a bookclub
CREATE TABLE checkpoints (
    club_id INTEGER REFERENCES bookclubs(id) ON DELETE CASCADE,
    checkpoint_num INTEGER NOT NULL,
    PRIMARY KEY (club_id, checkpoint_num),
    checkpoint_name TEXT NOT NULL
);

--Associates users with bookclubs (many-to-many relationship)
CREATE TABLE bookclub_members (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
    club_id INTEGER REFERENCES bookclubs(id) ON DELETE CASCADE,
    user_role TEXT NOT NULL CHECK (user_role IN ('member', 'moderator')),
    progress_checkpoint INTEGER,

    PRIMARY KEY (user_id, club_id),
    --the latest checkpoint that the user has unlocked in the bookclub
    FOREIGN KEY (club_id, progress_checkpoint)
    REFERENCES checkpoints(club_id, checkpoint_num)
    ON DELETE CASCADE
);

--Persisted discussion messages for each checkpoint/thread
CREATE TABLE checkpoint_messages (
    id SERIAL PRIMARY KEY,
    club_id INTEGER NOT NULL,
    checkpoint_num INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (club_id, checkpoint_num)
        REFERENCES checkpoints(club_id, checkpoint_num)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_checkpoint_messages_lookup
ON checkpoint_messages (club_id, checkpoint_num, created_at);

CREATE INDEX idx_bookclub_members_lookup
ON bookclub_members (user_id, club_id);