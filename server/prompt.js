function buildPrompt(notes) {
  return `You are helping a student study. Read the notes below and turn them into flashcards.

Rules:
- Make between 8 and 10 flashcards.
- Each flashcard has a "question" and an "answer".
- Keep each question short and clear.
- Keep each answer to one or two sentences.
- Only use facts that are in the notes. Do not add anything new.
- Reply with ONLY a JSON array. No introduction, no explanation, and no markdown code fences.

The reply must look exactly like this:
[
  { "question": "What does GET do?", "answer": "It asks the server to send back data without changing anything." }
]

Notes:
${notes}`;
}

module.exports = { buildPrompt };