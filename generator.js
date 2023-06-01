const fs = require('fs');
const pos = require('pos');

// Read the contents of wellness.txt and security.txt
const wellnessContent = fs.readFileSync('wellness.txt', 'utf-8');
const securityContent = fs.readFileSync('security.txt', 'utf-8');

// Split the contents into an array of sentences
const wellnessSentences = wellnessContent.split('\n').filter(Boolean);
const securitySentences = securityContent.split('\n').filter(Boolean);

// Generate a combined sentence
const combinedSentence = generateCombinedSentence(wellnessSentences, securitySentences);

console.log(combinedSentence);

// Function to generate a combined sentence
function generateCombinedSentence(wellnessSentences, securitySentences) {
  const combinedTokens = [];

  // Iterate over the sentences
  const minLength = Math.min(wellnessSentences.length, securitySentences.length);
  for (let i = 0; i < minLength; i++) {
    const wellnessSentence = wellnessSentences[i];
    const securitySentence = securitySentences[i];

    // Tokenize and tag the sentences
    const wellnessTagged = tagSentence(wellnessSentence);
    const securityTagged = tagSentence(securitySentence);

    // Find appropriate words to construct the sentence
    const verb = getRandomWordByTag(wellnessTagged, 'VB');
    const adjective = getRandomWordByTag(securityTagged, 'JJ');
    const noun = getRandomWordByTag(securityTagged, 'NN');

    // Check if all words are filled
    if (verb && adjective && noun) {
      // Build the sentence
      const sentence = `Consider ${verb}ing like an ${adjective} ${noun}.`;
      combinedTokens.push(sentence);
    }
  }

  // Randomly select a single sentence from the available options
  const randomIndex = Math.floor(Math.random() * combinedTokens.length);
  const combinedSentence = combinedTokens[randomIndex];
  return combinedSentence;
}

// Function to tokenize and tag a sentence
function tagSentence(sentence) {
  const words = new pos.Lexer().lex(sentence);
  const tagger = new pos.Tagger();
  return tagger.tag(words);
}

// Function to get a random word based on a specific tag, with fallback options
function getRandomWordByTag(taggedWords, tag) {
  const wordsWithMatchingTag = taggedWords.filter((word) => word[1].startsWith(tag));
  if (wordsWithMatchingTag.length === 0) {
    return getRandomWord(taggedWords); // Use a random word if no exact matching words are found
  }
  const randomIndex = Math.floor(Math.random() * wordsWithMatchingTag.length);
  return wordsWithMatchingTag[randomIndex][0];
}

// Function to get a random word from the tagged words
function getRandomWord(taggedWords) {
  if (taggedWords.length === 0) {
    return ''; // Return an empty string if no tagged words are available
  }
  const randomIndex = Math.floor(Math.random() * taggedWords.length);
  return taggedWords[randomIndex][0];
}
