import { useEffect, useState, useRef, useCallback } from 'react';

import { createContextAPI } from '../ContextAPI';
import { Logger } from 'src/libs/logger';

// @ts-ignore : always include at least 1 default language file (so we don't always have to fetch).
import DEFAULT_LANGUAGE_FILE from 'src/../public/lang/en_us.lang?raw';
const DEFAULT_LANGUAGE_CODE = 'en_us';

const LOGGER = new Logger('I18NService');

export const SUPPORTED_LANGUAGES = {
    'en_us': 'English',
    'xx_pirate': 'Pirate Speak',
};

const ContextAPI = createContextAPI(LocaleContextAPI, {
    setLanguage() {
        throw new Error('Not yet ready.');
    },
    getLocaleString(entity) {
        return entity;
    },
    langCode: '',
});

export const LANGS_URL = 'lang/';

export const LocaleProvider = ContextAPI.Provider;
export const LocaleConsumer = ContextAPI.Consumer;
export const useLocale = ContextAPI.useContext;

function LocaleContextAPI(props) {
    const [state, setState] = useState({ language: '' });
    const dictionary = useRef({});

    // Initialize to default language pack.
    useEffect(() => setLanguage(DEFAULT_LANGUAGE_CODE), []);

    const langCode = state.language;

    function setLanguage(langCode) {
        let temp = {};
        dictionary.current = temp;
        loadLanguageDictionary(langCode)
            .then(result => {
                if (dictionary.current === temp) {
                    LOGGER.info(`Language changed to '${langCode}'.`);

                    dictionary.current = result;
                    setState(state => {
                        state.language = langCode;
                        return { ...state };
                    });
                }
            })
            .catch(e => LOGGER.error(`Failed to change to language '${langCode}'.`, e));
    }

    function getLocaleString(entityName, ...args) {
        const dict = dictionary.current;
        if (dict && entityName in dict) {
            return parameterizeString(dict[entityName], args);
        } else {
            return entityName;
        }
    }

    return {
        setLanguage,
        getLocaleString,
        langCode,
    };
}

async function loadLanguageDictionary(langCode) {
    if (langCode === DEFAULT_LANGUAGE_CODE) {
        return parseLanguageFile(DEFAULT_LANGUAGE_FILE);
    } else {
        return fetch(`${LANGS_URL}${langCode}.lang`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                else {
                    return response.text();
                }
            })
            .then(parseLanguageFile);
    }
}

function parseLanguageFile(fileData) {
    let result = {};
    let lines = fileData.split('\n');
    let lineCount = 0;
    for (let line of lines) {
        ++lineCount;
        line = line.trim();
        // Allow comments...
        if (line.startsWith('//')) continue;
        if (line.startsWith('#')) continue;
        // Skip empty lines...
        if (line.length <= 0) continue;

        const index = line.indexOf('=');
        if (index < 0) {
            throw new Error(`Invalid language file format - cannot find assignment for line ${lineCount}.`);
        }

        const entityName = line.substring(0, index).trim();
        if (entityName.length <= 0) {
            throw new Error('Invalid language entity name format - cannot be empty string.');
        }
        else if (/[^-_.A-Za-z0-9]/.test(entityName)) {
            throw new Error('Invalid language entity name format - entity name must only use alphanumeric characters, periods, hyphens, and dashes.');
        }
        result[entityName] = line.substring(index + 1).trim();
    }
    return result;
}

/**
 * Replaces all instances of '$#', where # is a number, in the string to the
 * corresponding parameter element. The number corresponds directly to the index
 * in the parameter array, therefore it starts at 0.
 * 
 * @param {String} string The string to parameterize.
 * @param {Array<String>} params The parameters to insert into the string.
 * @returns {String} The resultant string.
 */
function parameterizeString(string, params) {
    return string.replace(/\$(\d+)/g, (substring, param1) => {
        const paramValue = Number(param1);
        if (params.length > paramValue) {
            return params[paramValue];
        }
        else {
            return '$' + paramValue;
        }
    });
}
