import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const { invertObj, forEachObjIndexed } = R;

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

const britishTimeMatcher = /^(\d{1,2})\.(\d{2})/;
const americanTimeMatcher = /^(\d{1,2}):(\d{2})/;

const britishToAmericanTime = str => str.replace(britishTimeMatcher, "$1:$2");
const americanToBritishTime = str => str.replace(americanTimeMatcher, "$1.$2");


const Locales = {
  "american-to-british": "american-to-british",
  "british-to-american": "british-to-american",
}

const DictionaryTypes = {
  titles: 'titles',
  spelling: 'spelling',
  wordsAndPhrases: "wordsAndPhrases",
}

const Time = {
  [Locales['american-to-british']]: {
    converter: americanToBritishTime,
    matcher: americanTimeMatcher,
  },
  [Locales['british-to-american']]: {
    converter: britishToAmericanTime,
    matcher: britishTimeMatcher,
  },
}

const Dictionaries = {
  [Locales['american-to-british']]: {
    titles: americanToBritishTitles,
    spelling: americanToBritishSpelling,
    wordsAndPhrases: americanOnly,
  },
  [Locales['british-to-american']]: {
    titles: britishToAmericanTitles,
    spelling: britishToAmericanSpelling,
    wordsAndPhrases: britishOnly,
  },
}

document.addEventListener('DOMContentLoaded', () => {
  translateButton.onclick = handleTranslate;
  clearButton.onclick = handleClear;
});

const wrapWithHighlightSpan = (newWord, originalWord) => `<span class="highlight" title="${originalWord}">${newWord}</span>`;


const translateWordsAndPhrases = (input, locale, highlightTranslations) => {
  const dictionary = Dictionaries[locale][DictionaryTypes.wordsAndPhrases];
  let hasTranslated = false,
      translatedInput = input;
  const replaceDictionaryMatch = (toLocalePhrase, fromLocalePhrase) => {
    /**
     * Do not match in-between phrases starting with '-',
     * and don't match in already translated phrases followed by highlight span.
     */
    const fromLocaleMatcher = new RegExp(`(?<!-)${fromLocalePhrase}\\b(?!</span>)`, 'ig');

    if (fromLocaleMatcher.test(translatedInput)) {
      translatedInput = replace(
          translatedInput,
          fromLocaleMatcher,
          () => highlightTranslations ? wrapWithHighlightSpan(toLocalePhrase, fromLocalePhrase) : toLocalePhrase,
      );
      hasTranslated = true;
    }
  }

  forEachObjIndexed(replaceDictionaryMatch, dictionary);

  return [translatedInput, hasTranslated];
}

const translateByWord = (input, locale, highlightTranslations, dictionaryType) => {
  const dictionary = Dictionaries[locale][dictionaryType];
  let hasTranslated = false;

  const words = input.split(' ');
  const translatedInput = words.map(word => {
    const lcWord = word.toLowerCase();
    const translation = dictionary[lcWord];

    if (translation) {
      const preservedCaseTranslation = replace(word, word, translation);
      hasTranslated = true;
      return highlightTranslations ? wrapWithHighlightSpan(preservedCaseTranslation, word) : preservedCaseTranslation;
    }
    return word;
  });

  return [translatedInput.join(' '), hasTranslated];
}

const convertTime = (input, locale, highlightTranslations) => {
  const matcher = Time[locale].matcher;
  const convert = Time[locale].converter;
  let hasConverted = false;

  const words = input.split(' ');
  const convertedInput = words.map(word => {
    if (matcher.test(word)) {
      hasConverted = true;
      const convertedTime = convert(word);
      return highlightTranslations ? wrapWithHighlightSpan(convertedTime, word) : convertedTime;
    }
    return word;
  });

  return [convertedInput.join(' '), hasConverted];
};

const translateSpelling = (input, locale, highlightTranslations) => {
  return translateByWord(input, locale, highlightTranslations, DictionaryTypes.spelling);
}

const translateTitles = (input, locale, highlightTranslations) => {
  return translateByWord(input, locale, highlightTranslations, DictionaryTypes.titles);
}

const translate = (input, locale, highlightTranslations = true) => {
  let translation = input,
      isTranslated = false;

  const updateTranslation = ([newTranslation, hasTranslation]) => {
    if (hasTranslation) {
      translation = newTranslation;
      isTranslated = hasTranslation;
    }
  };

  updateTranslation(translateWordsAndPhrases(translation, locale, highlightTranslations));
  updateTranslation(translateSpelling(translation, locale, highlightTranslations));
  updateTranslation(translateTitles(translation, locale, highlightTranslations));
  updateTranslation(convertTime(translation, locale, highlightTranslations));

  return [translation, isTranslated];
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

  const [translation, isTranslated] = translate(input, locale)

  if (isTranslated) {
    translationOutput.innerHTML = translation;
  } else {
    translationOutput.textContent = NO_TRANSLATION_NEEDED_MESSAGE;
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
