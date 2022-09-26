import { useState, useEffect } from 'react';

import { LocalStorage } from 'src/libs/storage/LocalStorage.js';
import { Logger } from 'src/libs/logger/Logger.js';
import { useForceUpdate } from 'src/hooks/ForceUpdate';

const LOGGER = new Logger('AutoSaveService');

/**
 * @callback SerializerFunction
 * @param {object} dst The data object to serialize into.
 * @returns {Promise<void>}
 * 
 * @callback DeserializerFunction
 * @param {object} src The data object to deserialize from.
 * @returns {Promise<void>}
 */

/**
 * Performs auto saving and loading using the given save key from localStorage. On initial call, it will
 * load from storage. For every subsequent state update, it will attempt to save after a short buffer time.
 * If no state changes occur, no saves will be performed.
 * 
 * @param {string} saveKey The unique key to save to in localStorage.
 * @param {SerializerFunction} serializer The serializer function to be called on save.
 * @param {DeserializerFunction} deserializer The deserializer function to be called on load.
 * @param {object} opts Any additional options.
 * @param {number} [opts.debounceMillis] The number of milliseconds to wait after state
 * change before saving.
 * @param {number} [opts.autosave] The number of milliseconds on interval before saving.
 * If infinite, will only save on state update.
 * @param {boolean} [opts.autoload] Whether to automatically load on mount.
 */
export function useAutoSave(saveKey, serializer, deserializer, opts = {}) {
    const { debounceMillis = 1000, autosave = Number.POSITIVE_INFINITY, autoload = true } = opts;

    const [init, setInit] = useState(false);
    const forceUpdate = useForceUpdate();

    // Auto saving/loading
    useEffect(() => {
        if (!init && autoload) {
            let shouldPerformLoad = true;
            const timeoutHandle = setTimeout(async () => {
                if (shouldPerformLoad) {
                    LOGGER.debug(`Auto loading '${saveKey}' data from localStorage...`);
                    const saveDataString = LocalStorage.getItem(saveKey);
                    if (saveDataString) {
                        try {
                            let saveData = JSON.parse(saveDataString);
                            await deserializer(saveData);
                        } catch (e) {
                            LOGGER.error('Failed to deserialize save data.', e);
                        }
                    }
                    setInit(true);
                }
            }, 0);
            return () => {
                shouldPerformLoad = false;
                clearTimeout(timeoutHandle);
            }
        } else if (autosave > 0) {
            let shouldPerformSave = true;
            const timeoutHandle = setTimeout(async () => {
                if (shouldPerformSave) {
                    LOGGER.debug(`Auto saving '${saveKey}' data to localStorage...`);
                    try {
                        let saveData = {};
                        await serializer(saveData);
                        LocalStorage.setItem(saveKey, JSON.stringify(saveData));
                    } catch (e) {
                        LOGGER.error('Failed to serialize save data.', e);
                    }
                    if (Number.isFinite(autosave)) {
                        setTimeout(forceUpdate, autosave);
                    }
                }
            }, debounceMillis);

            return () => {
                shouldPerformSave = false;
                clearTimeout(timeoutHandle);
            };
        }
    }, [autoload, autosave, debounceMillis, deserializer, init, saveKey, serializer]);
}
