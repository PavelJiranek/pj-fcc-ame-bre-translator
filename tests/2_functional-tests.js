/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;
const R = require("ramda");
const RA = require("ramda-adjunct");
const replace = require("preserve-case");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Translator;


suite('Functional Tests', () => {
    suiteSetup(() => {
        return JSDOM.fromFile('./views/index.html')
            .then((dom) => {
                global.window = dom.window;
                if (typeof document === 'undefined') {
                    global.document = dom.window.document;
                }
                global.R = R;
                global.RA = RA;
                global.replace = replace;

                Translator = require('../public/translator.js');

                global.textArea = document.getElementById('text-input');
                global.translationOutput = document.getElementById('translated-sentence');
                global.errorContainer = document.getElementById('error-msg');

            });
    });

    suite('Function handleTranslate()', () => {
        /*
          The translated sentence is appended to the `translated-sentence` `div`
          and the translated words or terms are wrapped in
          `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
        */
        test("Translation appended to the `translated-sentence` `div`", done => {
            const INPUT = 'Dr. Wright localizes colorful books only at 10:30 AM.';
            const TEXT_OUTPUT = 'Dr Wright localises colourful books only at 10.30 AM.';
            const HTML_OUTPUT = '<span class="highlight">Dr</span> Wright <span class="highlight">localises</span> <span class="highlight">colourful</span> books only at <span class="highlight">10.30</span> AM.';

            assert.isFalse(!!translationOutput.textContent); // sanity check

            textArea.value = INPUT;
            Translator.handleTranslate();

            assert.equal(translationOutput.textContent, TEXT_OUTPUT);
            assert.equal(translationOutput.innerHTML, HTML_OUTPUT);

            done();
        });

        /*
          If there are no words or terms that need to be translated,
          the message 'Everything looks good to me!' is appended to the
          `translated-sentence` `div` when the "Translate" button is pressed.
        */
        test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
            textArea.value = "There are no words or terms that need to be translated";
            Translator.handleTranslate();

            assert.equal(translationOutput.textContent, Translator.NO_TRANSLATION_NEEDED_MESSAGE);

            done();
        });

        /*
          If the text area is empty when the "Translation" button is
          pressed, append the message 'Error: No text to translate.' to
          the `error-msg` `div`.
        */
        test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
            textArea.value = "";
            assert.isFalse(!!errorContainer.textContent); // sanity check

            Translator.handleTranslate();

            assert.equal(errorContainer.textContent, Translator.NO_TEXT_TO_TRANSLATE_ERROR);

            done();
        });

    });

    suite('Function handleClear()', () => {
        /*
          The text area and both the `translated-sentence` and `error-msg`
          `divs` are cleared when the "Clear" button is pressed.
        */
        test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
            textArea.value = "textarea";
            translationOutput.textContent = 'translationOutput';
            errorContainer.textContent = 'errorContainer';

            assert.isTrue(!!textArea.value); // sanity check
            assert.isTrue(!!translationOutput.textContent); // sanity check
            assert.isTrue(!!errorContainer.textContent); // sanity check

            Translator.handleClear();

            assert.isFalse(!!textArea.value);
            assert.isFalse(!!translationOutput.textContent);
            assert.isFalse(!!errorContainer.textContent);

            done();
        });

    });

});
