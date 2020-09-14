import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const textArea = document.getElementById('text-input');
const localeSelect = document.getElementById('locale-select');
const translateButton = document.getElementById('translate-btn');
const clearButton = document.getElementById('clear-btn');
const translationOutput = document.getElementById('translated-sentence');
const errorContainer = document.getElementById('error-msg');

const LOCALES = {
  "american-to-british": "american-to-british",
  "british-to-american": "british-to-american",
}
const NO_TEXT_TO_TRANSLATE_ERROR = "Error: No text to translate.";
const NO_TRANSLATION_NEEDED_MESSAGE = "Everything looks good to me!";

document.addEventListener('DOMContentLoaded', () => {
  translateButton.onclick = handleTranslate;
  clearButton.onclick = handleClear;
});

const handleTranslate = () => {
  if (!textArea.value) {
    translationOutput.textContent = ''
    errorContainer.textContent = NO_TEXT_TO_TRANSLATE_ERROR;
  } else {
    translationOutput.textContent = NO_TRANSLATION_NEEDED_MESSAGE;
    errorContainer.textContent = '';
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
  }
} catch (e) {
}
