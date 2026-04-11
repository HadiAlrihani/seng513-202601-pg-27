# Wormly Connected

A social book-tracking web app where users can manage their bookshelf, join book clubs, and connect with friends.

## Team

- Hadi Alrihani
- Mahir Alam
- Sohaib Zia
- Adiba Hossain

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Containerization:** Docker

## Features

- User registration and login
- Personal bookshelf with reading status, ratings, and reviews
- Book search via the Open Library API
- Book clubs (public and private)
- Friends and friend bookshelves
- Admin dashboard for managing users and book clubs

## Running the App

Requires Docker Desktop to be running.

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

To rebuild from scratch (clears the database):

```bash
docker-compose down -v && docker-compose up --build
```

## Environment Variables

Create a `.env` file in the project root:

```
DB_HOST=db
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
SECRET_KEY=any_random_string
DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/your_db_name
```

## AI Usage

This project used Claude Sonnet 4.6 (Anthropic) in a support role.

- Assisted with resolving merge conflicts when merging feature branches into main
- Assisted with outlining recommended workflows and steps to follow during development

All AI assisted output was reviewed thoroughly and adjusted by the team before use.
