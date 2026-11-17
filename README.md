# LearnEasy: Study Flashcards from Notes

Paste your study notes and the app turns them into flashcards using AI. You can edit the cards and save them to a deck.

## Tech used

- React (built with Vite) for the website
- Node.js and Express for the server (API)
- Neon (Postgres) for the database
- Google Gemini for the AI, with Groq as a backup
- Email and password login with a token (JWT)

## How to run it on your computer

You need Node.js 18 or newer.

1. Get the code:

```
git clone https://github.com/Rebecca38/flashcards-app.git
cd flashcards-app
```

2. Start the server. In the `server` folder, copy `.env.example` to a new file named `.env`, fill in the values, then run:

```
cd server
npm install
node index.js
```

3. Start the website. Open a second terminal and run:

```
cd client
npm install
npm run dev
```

4. Open `http://localhost:5173` in your browser.

## Environment values

The server reads its secrets from `server/.env`. This file is never uploaded to GitHub. The file `server/.env.example` lists the names with placeholder values:

- `PORT`: the port the server uses (5000)
- `JWT_SECRET`: a long random text used to sign login tokens
- `DATABASE_URL`: the connection string from your Neon database
- `GEMINI_API_KEY`: a free key from Google AI Studio
- `GROQ_API_KEY`: a free key from Groq, used as the backup AI

The keys and the database URL stay on the server and are never sent to the browser.

## How the AI part works

- The server asks Gemini first. If Gemini fails (busy, slow, or an error), it asks Groq instead.
- The server checks the AI reply before using it. If any card is incomplete, the whole reply is rejected.
- The page shows a clear message with a Retry button for three cases: the AI is slow or the internet fails, the AI sends back a reply that cannot be read, and the free AI limit is reached.

## Saving a deck

Save deck stores all the cards of a deck in one step: either every card is saved or none. If a save fails, the old cards are kept, so no half-finished data is stored.

## How to run the tests

The tests check the code that reads the AI reply (`parseCards`). They use saved sample replies in `server/test-data`, so they do not call the real AI and need no API key.

You need Node.js 18 or newer.

1. Install the server libraries (first time only):

```
cd server
npm install
```

2. Run the tests:

```
npm test
```

You should see 5 passing tests:
- a good reply gives clean cards
- a reply with extra text around the cards still works
- a reply with a card missing its answer is rejected
- a reply with broken JSON is rejected
- an empty reply is rejected