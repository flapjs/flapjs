import React from 'react';

import { useAutoSave } from 'src/libs/autosave';
import { useLocale } from 'src/libs/i18n';

/**
 * @typedef {import('../../components/App').default} App
 */

/**
 * @param {object} props
 * @param {App} props.app
 * @param {object} props.module
 */
export function AppInit({ app, module }) {
    useLangSaver(app, module);
    useThemeSaver(app, module);
    return (
        <></>
    );
}

/**
 * @param {App} app 
 * @param {object} module 
 */
function useLangSaver(app, module) {
    const storageKey = 'prefs-lang';

    const locale = useLocale();

    async function serializer(dst) {
        Object.assign(dst, locale.getLanguageDictionary());
    }

    async function deserializer(src) {
        Object.assign(locale.getLanguageDictionary(), src);
    }

    useAutoSave(storageKey, serializer, deserializer, { autosave: 1_000 });
}

/**
 * @param {App} app 
 * @param {object} module 
 */
 function useThemeSaver(app, module) {

    async function serializer(dst) {
        const themeManager = app._themeManager;
        for(let style of themeManager.getStyles()) {
            const styleName = style.getName();
            const styleValue = style.getValue();
            dst[styleName] = styleValue;
        }
    }

    async function deserializer(src) {
        const themeManager = app._themeManager;
        for(let key in src) {
            let style = themeManager.getStyleByName(key);
            if (style) {
                style.setValue(src[key]);
            }
        }
    }

    async function themeSerializer(dst) {
        const themeManager = app._themeManager;
        const theme = themeManager.getCurrentTheme();
        dst.theme = theme.getName();
    }

    async function themeDeserializer(src) {
        // Do nothing.
    }

    useAutoSave('prefs-color', serializer, deserializer, { autosave: 1_000 });
    useAutoSave('prefs-theme', themeSerializer, themeDeserializer, { autosave: 1_000 });
}
