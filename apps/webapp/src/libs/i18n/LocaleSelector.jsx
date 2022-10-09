import React, { useCallback, useLayoutEffect } from 'react';

import { SUPPORTED_LANGUAGES, useLocale } from './LocaleContext.jsx';

/**
 * @param {object} props 
 * @param {object} [props.languages]
 */
export function LocaleSelector(props) {
    const { languages = SUPPORTED_LANGUAGES } = props;
    const { langCode, setLanguage } = useLocale();

    const onBlur = useCallback(
        function onBlur(e) {
            setLanguage(e.target.value);
        }, [setLanguage]);

    useLayoutEffect(() => {
        document.documentElement.lang = langCode;
    }, [langCode]);

    return (
        <select onBlur={onBlur}>
            {Object.entries(languages).map(([key, value]) => (
                <LanguageOption key={key} langCode={key}>
                    {value}
                </LanguageOption>
            ))}
        </select>
    );
}

/**
 * @param {object} props
 * @param {string} [props.langCode]
 * @param {React.ReactNode} [props.children]
 */
function LanguageOption(props) {
    const { children, langCode } = props;
    return (
        <option value={langCode}>
            {children}
        </option>
    );
}
