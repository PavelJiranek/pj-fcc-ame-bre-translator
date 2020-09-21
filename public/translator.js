import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const { invertObj } = R;

const britishToAmericanTitles = invertObj(americanToBritishTitles);
const britishToAmericanSpelling = invertObj(americanToBritishSpelling);

const textArea = document.getElementById('text-input');
const localeSelect = document.getElementById('locale-select');
const translateButton = document.getElementById('translate-btn');
const clearButton = document.getElementById('clear-btn');
const translationOutput = document.getElementById('translated-sentence');
const errorContainer = document.getElementById('error-msg');

const NO_TEXT_TO_TRANSLATE_ERROR = "Error: No text to translate.";
const NO_TRANSLATION_NEEDED_MESSAGE = "Everything looks good to me!";

const Locales = {
  "american-to-british": "american-to-british",
  "british-to-american": "british-to-american",
}

const DictionaryTypes = {
  titles: 'titles',
  spelling: 'spelling',
  wordsAndPhrases: "wordsAndPhrases",
}

const Dictionaries = {
  "american-to-british": {
    titles: americanToBritishTitles,
    spelling: americanToBritishSpelling,
    wordsAndPhrases: americanOnly,
  },
  "british-to-american": {
    titles: britishToAmericanTitles,
    spelling: britishToAmericanSpelling,
    wordsAndPhrases: britishOnly,
  },
}

document.addEventListener('DOMContentLoaded', () => {
  translateButton.onclick = handleTranslate;
  clearButton.onclick = handleClear;
});

const wrapTranslatedWord = word => `<span class="highlight">${word}</span>`;

const translateByWord = (input, locale, dictionaryType) => {
  const dictionary = Dictionaries[locale][dictionaryType];
  let counter = 0;

  const words = input.split(' ');
  const translatedInput = words.map(word => {
    const lcWord = word.toLowerCase();
    const translation = dictionary[lcWord];

    if (translation) {
      const preservedCaseTranslation = replace(word, word, translation);
      counter++;
      return wrapTranslatedWord(preservedCaseTranslation);
    }
    return word;
  });

  return [translatedInput.join(' '), counter];
}

const translateSpelling = (input, locale) => {
  return translateByWord(input, locale, DictionaryTypes.spelling);
}

const translateTitles = (input, locale) => {
  return translateByWord(input, locale, DictionaryTypes.titles);
}


const handleTranslate = () => {
  if (!textArea.value) {
    translationOutput.textContent = ''
    errorContainer.textContent = NO_TEXT_TO_TRANSLATE_ERROR;
    return;
  }
  errorContainer.textContent = '';

  const locale = Locales[localeSelect.value],
      input = textArea.value;
  let translation = '',
      translatedCounter = 0,
      translations = [];

  const updateTranslation = ([newTranslation, newCount]) => {
    if (newCount) {
      translation = newTranslation;
      translatedCounter = newCount;
    }
  };

  updateTranslation(translateSpelling(input, locale));
  updateTranslation(translateTitles(translation, locale));


  if (translatedCounter === 0) {
    translationOutput.textContent = NO_TRANSLATION_NEEDED_MESSAGE;
  } else {
    translationOutput.innerHTML = translation;
  }
}

const handleClear = () => {
  textArea.value = '';
  translationOutput.textContent = '';
  errorContainer.textContent = '';
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    handleTranslate,
    handleClear,
    NO_TEXT_TO_TRANSLATE_ERROR,
    NO_TRANSLATION_NEEDED_MESSAGE
  }
} catch (e) {
}
