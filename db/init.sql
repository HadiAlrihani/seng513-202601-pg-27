/*
Schema of the Wormly Connected database. Handles relationships between
users and books, authors, genres, bookclubs, and other users.*/



CREATE TABLE books (
    isbn TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image TEXT,
    book_length INTEGER NOT NULL
);

CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    genre_name TEXT UNIQUE NOT NULL
);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    author_name TEXT NOT NULL
);

CREATE TABLE bookclubs (
    id SERIAL PRIMARY KEY,
    book_isbn TEXT REFERENCES books(isbn),
    book_title TEXT NOT NULL,
    club_name TEXT NOT NULL,
    number_members INTEGER NOT NULL,
    max_members INTEGER NOT NULL,
    club_description TEXT,

    --boolean flagging whether the club is public or private
    public BOOLEAN DEFAULT true
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,

    --These two keep track of last interacted with book/club for quick user access
    last_updated_isbn TEXT REFERENCES books(isbn),
    last_updated_club INTEGER REFERENCES bookclubs(id)
);

CREATE TABLE user_friends (
    friend1_id INTEGER REFERENCES users(id),
    friend2_id INTEGER REFERENCES users(id),
    PRIMARY KEY (friend1_id, friend2_id)
);

--Associates users with books (many-to-many relationsihp)
CREATE TABLE user_books (
    user_id INTEGER REFERENCES users(id),
    book_isbn TEXT REFERENCES books(isbn),
    PRIMARY KEY (user_id, book_isbn),
    date_started DATE,
    date_finished DATE,
    read_status TEXT CHECK (read_status IN ('to_read', 'reading', 'finished')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,

    --whether a user has this book as one of their favorites
    is_favorite BOOLEAN
);


--Users can associate themselves with genres they like
--Associates users with genres (many-to-many relationship)
CREATE TABLE user_genres (
    user_id INTEGER REFERENCES users(id),
    genre_id INTEGER REFERENCES genres(id),
    PRIMARY KEY (user_id, genre_id)
);


--Associates books with genres (many-to-many relationship)
--Prevents us from storing book genres as a list in the books table
CREATE TABLE book_genres (
    book_isbn TEXT REFERENCES books(isbn),
    genre_id INTEGER REFERENCES genres(id),
    PRIMARY KEY (book_isbn, genre_id)
);


--Associates users with authors they want to follow (many-to-many relationship)
CREATE TABLE user_authors (
    user_id INTEGER REFERENCES users(id),
    author_id INTEGER REFERENCES authors(id),
    PRIMARY KEY (user_id, author_id)
);


--each entry is a checkpoint/thread in a bookclub
CREATE TABLE checkpoints (
    club_id INTEGER REFERENCES bookclubs(id),
    checkpoint_num INTEGER NOT NULL,
    PRIMARY KEY (club_id, checkpoint_num),
    checkpoint_name TEXT NOT NULL
);

--Associates users with bookclubs (many-to-many relationship)
CREATE TABLE bookclub_members (
    user_id INTEGER REFERENCES users(id), 
    club_id INTEGER REFERENCES bookclubs(id),
    user_role TEXT NOT NULL CHECK (user_role IN ('member', 'moderator')),

    progress_checkpoint INTEGER,

    PRIMARY KEY (user_id, club_id),
    --the latest checkpoint that the user has unlocked in the bookclub
    FOREIGN KEY (club_id, progress_checkpoint)
    REFERENCES checkpoints(club_id, checkpoint_num)
);