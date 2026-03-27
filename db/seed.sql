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
they unwittingly become the faces of an impending rebellion. |'),

('0553386794', '9780553386790', 'A Game of Thrones (HBO Tie-in Edition)', 'George R. R. Martin',
'http://books.google.com/books/content?id=hXNvadj27ekC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
722, 
'NOW THE ACCLAIMED HBO SERIES GAME OF THRONES—THE MASTERPIECE THAT BECAME A CULTURAL PHENOMENON Here is the first book 
in the landmark series that has redefined imaginative fiction and become a modern masterpiece. A GAME OF THRONES In a 
land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen 
wastes to the North of Winterfell, sinister and supernatural forces are massing beyond the kingdom’s protective Wall. 
At the center of the conflict lie the Starks of Winterfell, a family as harsh and unyielding as the land they were born to. 
Sweeping from a land of brutal cold to a distant summertime kingdom of epicurean plenty, here is a tale of lords and ladies, 
soldiers and sorcerers, assassins and bastards, who come together in a time of grim omens. Amid plots and counterplots, 
tragedy and betrayal, victory and terror, the fate of the Starks, their allies, and their enemies hangs perilously in the balance, 
as each endeavors to win that deadliest of conflicts: the game of thrones. A GAME OF THRONES • A CLASH OF KINGS • A STORM OF SWORDS • 
A FEAST FOR CROWS • A DANCE WITH DRAGONS');

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

INSERT INTO bookclubs (book_id, book_title, club_name, club_code, number_members, max_members, 
club_description, visibility) VALUES
(2, 
'The Hunger Games', 'Hunger Games book club', NULL, 2, 10, 
'Book Club for The Hunger Games', 'public');

INSERT INTO users (username, email, user_password, last_updated_id, last_updated_club) VALUES
('admin', 'admin.email@gmail.com', 'admin123', NULL, NULL),
('club_moderator', 'mod@gmail.com', 'mod123', 2, 1),
('book_enjoyer', 'reader@gmail.com', 'books123', 2, 1);

INSERT INTO user_friends (friend1_id, friend2_id) VALUES (2, 3);

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

INSERT INTO checkpoints (club_id, checkpoint_num, checkpoint_name) VALUES
(1, 1, 'Chapter 1 discussion'),
(1, 2, 'Chapter 2 discussion'),
(1, 3, 'Chapter 3 discussion');

INSERT INTO bookclub_members (user_id, club_id, user_role, progress_checkpoint) VALUES
(2, 1, 'moderator', 3),
(3, 1, 'member', 2);