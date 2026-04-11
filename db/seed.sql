/*
Seed that is run after init.sql 
Populates the database with initial data
*/

INSERT INTO books (isbn_10, isbn_13, title, author, cover_image, book_length, book_description) VALUES
('0441013597', '9780441013593', 'Dune', 'Frank Herbert', 
'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
548,
'Frank Herbert’s classic masterpiece—a triumph of the imagination and one of the bestselling science fiction novels of all time. 
Set on the desert planet Arrakis, Dune is the story of Paul Atreides—who would become known as Muad''Dib—and of a great family''s 
ambition to bring to fruition humankind''s most ancient and unattainable dream. A stunning blend of adventure and mysticism, 
environmentalism and politics, Dune won the first Nebula Award, shared the Hugo Award, and formed the basis of what is undoubtedly the 
grandest epic in science fiction.'),

('0439023521', '9780439023528', 'The Hunger Games', 'Suzanne Collins',
'http://books.google.com/books/content?id=hlb_sM1AN0gC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
386,
'By winning the Hunger Games, Katniss and Peeta have secured a life of safety 
and plenty for themselves and their families, but because they won by defying the rules, 
they unwittingly become the faces of an impending rebellion.'),

('0553386794', '9780553386790', 'A Game of Thrones (HBO Tie-in Edition)', 'George R. R. Martin',
'http://books.google.com/books/content?id=hXNvadj27ekC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
722, 
'NOW THE ACCLAIMED HBO SERIES GAME OF THRONES—THE MASTERPIECE THAT BECAME A CULTURAL PHENOMENON Here is the first book 
in the landmark series that has redefined imaginative fiction and become a modern masterpiece.');

INSERT INTO genres(genre_name) VALUES
('Science Fiction'),
('Fiction'),
('Autobiography'),
('Horror'),
('Dystopia');

INSERT INTO authors (author_name) VALUES
('Frank Herbert'),
('Suzanne Collins'),
('George R. R. Martin');

INSERT INTO users (username, email, user_password, last_viewed_club, last_updated_club, last_updated_checkpoint) VALUES

/*The password for admin is admin123*/
('admin', 'admin.email@gmail.com', '$2b$10$MMxloxulFa3HmlnS1NaTyey0unknfEjQd1uFXTlAHiITCtKmDALym', NULL, NULL, NULL),

/*The password for moderator is mod123*/
('club_moderator', 'mod@gmail.com', '$2b$10$mLcdM6lmDlxTvSmrpS4/tOZAhuyLiazMy5j7sNFR6.PTPfud3DocK', NULL, NULL, NULL),

/*The password for enjoyer is books123*/
('book_enjoyer', 'reader@gmail.com', '$2b$10$qkblFxORoJrK0jup2P42VOCIpEuxoLGSWqUKJWHEz.mRTzY0BEsmu', NULL, NULL, NULL);

INSERT INTO bookclubs (book_id, book_title, club_name, club_code, number_members, max_members, 
club_description, visibility) VALUES
(1, 'Dune', 'Dune Deep Dive', NULL, 20, 20, 'Analyze themes and world-building in Dune.', 'public'),
(2,'The Hunger Games', 'Hunger Games book club', NULL, 2, 10, 'Book Club for The Hunger Games', 'public'),
(2, 'The Hunger Games', 'Elite Hunger Club', 'HG999', 3, 10, 'Invite-only Hunger Games discussion.', 'private'),
(3, 'A Game of Thrones (HBO Tie-in Edition)', 'Westeros Politics Club', NULL, 6, 20, 'Discuss power, betrayal, and strategy.', 'public');


INSERT INTO checkpoints (club_id, checkpoint_num, checkpoint_name) VALUES
(1, 1, 'Chapter 1 discussion'),
(1, 2, 'Chapter 2 discussion'),
(1, 3, 'Chapter 3 discussion'),
(2, 1, 'Part 1 discussion'),
(2, 2, 'Part 2 discussion'),
(2, 3, 'Final discussion'),
(3, 1, 'Tribute selection discussion'),
(3, 2, 'Arena strategy discussion'),
(3, 3, 'Final survival discussion'),
(4, 1, 'Opening chapters discussion'),
(4, 2, 'Mid-book discussion'),
(4, 3, 'Ending discussion');

INSERT INTO user_friends (friend1_id, friend2_id) VALUES
(2, 3);

INSERT INTO user_books (user_id, book_id, date_started, date_finished, read_status, rating, review, is_favorite) VALUES
(2, 2, '2026-02-01', NULL, 'reading', NULL, NULL, FALSE),
(2, 3, '2026-01-01', '2026-01-20', 'finished', 5, 'review of book here', TRUE),
(3, 2, '2026-02-01', NULL, 'reading', NULL, NULL, FALSE),
(3, 1, NULL, NULL, 'to_read', NULL, NULL, FALSE);

INSERT INTO user_genres (user_id, genre_id) VALUES
(2, 1), 
(3, 1), 
(3, 5);

INSERT INTO book_genres (book_id, genre_id) VALUES
(1, 1),
(2, 5),
(3, 2);

INSERT INTO user_authors (user_id, author_id) VALUES
(2, 3),
(2, 2),
(3, 2);


INSERT INTO bookclub_members (user_id, club_id, user_role, progress_checkpoint) VALUES
(2, 1, 'moderator', 3),
(3, 1, 'member', 2),
(2, 2, 'moderator', 1),
(3, 2, 'member', 1),
(2, 3, 'moderator', 2),
(3, 3, 'member', 1),
(2, 4, 'moderator', 2),
(3, 4, 'member', 1);

INSERT INTO checkpoint_messages (club_id, checkpoint_num, user_id, message_text) VALUES
(1, 1, 2, 'Welcome everyone. Keep this checkpoint spoiler-safe and focused on Chapter 1 only.'),
(1, 1, 3, 'I already like the opening world-building a lot.'),
(1, 2, 2, 'Chapter 2 adds much more political tension.'),
(1, 2, 3, 'Agreed. It feels much bigger now.'),
(1, 3, 2, 'This checkpoint is where the pacing really starts to build.'),

(2, 1, 2, 'Let’s keep this first discussion focused on the opening setup.'),
(2, 1, 3, 'The contrast in the world is already very strong.'),
(2, 2, 2, 'This part makes the stakes feel much more personal.'),

(3, 1, 2, 'Welcome to the private Hunger Games discussion. Please keep this checkpoint spoiler-safe.'),
(3, 1, 3, 'The opening already sets up the pressure really well.'),
(3, 2, 2, 'This checkpoint is where strategy starts to matter a lot more.'),

(4, 1, 2, 'Let’s focus on the early political setup only for this checkpoint.'),
(4, 1, 3, 'There are already so many competing interests in the opening chapters.'),
(4, 2, 2, 'Mid-book is where the power dynamics become much clearer.');

UPDATE users
SET last_viewed_club = 2,
    last_updated_club = 4,
    last_updated_checkpoint = 2
WHERE username = 'club_moderator';

UPDATE users
SET last_viewed_club = 2,
    last_updated_club = 4,
    last_updated_checkpoint = 1
WHERE username = 'book_enjoyer';