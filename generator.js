// caling filesystem and parts of speech js libraries
const fs = require('fs');
const pos = require('pos');

// reading in source text files
const wellnessContent = fs.readFileSync('wellness.txt', 'utf-8');
const securityContent = fs.readFileSync('security.txt', 'utf-8');

// breaking texts into sentences
const wellnessSentences = wellnessContent.split('\n').filter(Boolean);
const securitySentences = securityContent.split('\n').filter(Boolean);

// re-building into new sentences from following function rules
const combinedSentence = generateCombinedSentence(wellnessSentences, securitySentences);

console.log(combinedSentence);

// generate new sentences
function generateCombinedSentence(wellnessSentences, securitySentences) {
  const combinedTokens = [];

  // adding variation to the new sentences -- avoid getting the same thing over and over
  const minLength = Math.min(wellnessSentences.length, securitySentences.length);
  for (let i = 0; i < minLength; i++) {
    const wellnessSentence = wellnessSentences[i];
    const securitySentence = securitySentences[i];

    // tag word types in source sentences
    const wellnessTagged = tagSentence(wellnessSentence);
    const securityTagged = tagSentence(securitySentence);

    // grab specific word types from difference source sentence arrays
    const verb = getRandomWordByTag(wellnessTagged, 'VB');
    const adjective = getRandomWordByTag(securityTagged, 'JJ');
    const noun = getRandomWordByTag(securityTagged, 'NN');

    // make sure we have each word type represented
    if (verb && adjective && noun) {
      // put it all together into a new sentence
      const sentence = `Consider ${verb}ing like an ${adjective} ${noun}.`;
      combinedTokens.push(sentence);
    }
  }

  // randomly choose a single generated sentence
  const randomIndex = Math.floor(Math.random() * combinedTokens.length);
  const combinedSentence = combinedTokens[randomIndex];
  return combinedSentence;
}

// pos sentence tagging 
function tagSentence(sentence) {
  const words = new pos.Lexer().lex(sentence);
  const tagger = new pos.Tagger();
  return tagger.tag(words);
}

// pos word grabbing by tag
function getRandomWordByTag(taggedWords, tag) {
  const wordsWithMatchingTag = taggedWords.filter((word) => word[1].startsWith(tag));
  if (wordsWithMatchingTag.length === 0) {
    return getRandomWord(taggedWords); // Use a random word if no exact matching words are found
  }
  const randomIndex = Math.floor(Math.random() * wordsWithMatchingTag.length);
  return wordsWithMatchingTag[randomIndex][0];
}

// random selected of word by tag
function getRandomWord(taggedWords) {
  if (taggedWords.length === 0) {
    return ''; // blanks if no returned word
  }
  const randomIndex = Math.floor(Math.random() * taggedWords.length);
  return taggedWords[randomIndex][0];
}
