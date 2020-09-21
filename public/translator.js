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

const translateByWord = (input, locale, highlightTranslations, dictionaryType) => {
  const dictionary = Dictionaries[locale][dictionaryType];
  let counter = 0;

  const words = input.split(' ');
  const translatedInput = words.map(word => {
    const lcWord = word.toLowerCase();
    const translation = dictionary[lcWord];

    if (translation) {
      const preservedCaseTranslation = replace(word, word, translation);
      counter++;
      return highlightTranslations ? wrapTranslatedWord(preservedCaseTranslation) : preservedCaseTranslation;
    }
    return word;
  });

  return [translatedInput.join(' '), counter];
}

const translateSpelling = (input, locale, highlightTranslations) => {
  return translateByWord(input, locale, highlightTranslations, DictionaryTypes.spelling);
}

const translateTitles = (input, locale, highlightTranslations) => {
  return translateByWord(input, locale, highlightTranslations, DictionaryTypes.titles);
}

const translate = (input, locale, highlightTranslations = true) => {
  let translation = input,
      translatedCounter = 0;

  const updateTranslation = ([newTranslation, newCount]) => {
    if (newCount) {
      translation = newTranslation;
      translatedCounter = newCount;
    }
  };

  updateTranslation(translateSpelling(translation, locale, highlightTranslations));
  updateTranslation(translateTitles(translation, locale, highlightTranslations));
  return [translation, translatedCounter];
};

const handleTranslate = () => {
  if (!textArea.value) {
    translationOutput.textContent = ''
    errorContainer.textContent = NO_TEXT_TO_TRANSLATE_ERROR;
    return;
  }
  errorContainer.textContent = '';

  const locale = Locales[localeSelect.value],
      input = textArea.value;

  const [translation, noOfTranslations] = translate(input, locale)

  if (noOfTranslations === 0) {
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
    translate,
    NO_TEXT_TO_TRANSLATE_ERROR,
    NO_TRANSLATION_NEEDED_MESSAGE,
    Locales,
  }
} catch (e) {
}
