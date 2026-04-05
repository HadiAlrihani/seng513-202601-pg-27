CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    user_password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE

);

-- Dev-only admin; password: admin123 (change in production)
INSERT INTO users (username, email, user_password, is_admin)
VALUES (
    'admin',
    'admin@email.com',
    '$2b$10$9nHhTK.1zWixmOSlfj8EQOZQ9eOjnjc0EYmMICJEgFR841HXJwFAi',
    TRUE
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