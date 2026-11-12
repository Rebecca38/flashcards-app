const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { parseCards } = require('./parseCards');

function readSample(fileName) {
  return fs.readFileSync(path.join(__dirname, 'test-data', fileName), 'utf8');
}

test('a good reply gives clean cards', () => {
  const cards = parseCards(readSample('good-reply.txt'));

  assert.strictEqual(cards.length, 3);
  assert.deepStrictEqual(cards[0], {
    question: 'What does GET do?',
    answer: 'GET reads data.',
  });
});

test('a reply with extra text around the cards still works', () => {
  const cards = parseCards(readSample('junk-around-reply.txt'));

  assert.strictEqual(cards.length, 2);
  assert.strictEqual(cards[1].question, 'What does DELETE do?');
});

test('a reply with a card missing its answer is rejected', () => {
  assert.throws(
    () => parseCards(readSample('missing-field-reply.txt')),
    /missing its question or answer/
  );
});

test('a reply with broken JSON is rejected', () => {
  assert.throws(
    () => parseCards(readSample('invalid-json-reply.txt')),
    /not valid JSON/
  );
});

test('an empty reply is rejected', () => {
  assert.throws(
    () => parseCards(readSample('empty-reply.txt')),
    /was empty/
  );
});