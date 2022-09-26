import React from 'react';

import { useAutoSave } from 'src/libs/autosave';
import { Logger } from 'src/libs/logger';

const LOGGER = new Logger('FiniteAutomata.Init');

/**
 * @typedef {import('../../components/App').default} App
 * @typedef {import('./FSAModule').default} FSAModule
 */

/**
 * @param {object} props
 * @param {App} props.app
 * @param {FSAModule} props.module
 */
export function Init({ app, module }) {
    useGraphSaver(app, module);
    return (
        <></>
    );
}

/**
 * @param {App} app 
 * @param {FSAModule} module 
 */
function useGraphSaver(app, module) {
    const storageKey = 'graph-' + module.getModuleName();

    async function serializer(dst) {
        try {
            const result = await app.getExportManager().tryExportTargetToData('session', app.getSession());
            Object.assign(dst, JSON.parse(result.data));
        } catch (e) {
            LOGGER.error('Failed to export graph.', e);
        }
    }

    async function deserializer(src) {
        try {
            await app.getImportManager().tryImportFileFromData('', '.json', JSON.stringify(src));
        } catch (e) {
            LOGGER.error('Failed to import graph.', e);
        }
    }

    useAutoSave(storageKey, serializer, deserializer, { autosave: 1_000 });
}
