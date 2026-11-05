# Talk notes
- I created two tables which are users and decks. Each deck stores the id of the user who owns it, so one user can have many decks.
- I made the server create the tables when it starts, so the database is always ready before anyone uses the app.
- Plan: I'll scramble passwords with bcrypt so real passwords are never stored.