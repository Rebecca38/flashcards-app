# LearnEasy: Study Flashcards from Notes

Paste your study notes and the app turns them into flashcards using AI (Google Gemini).

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