export { HistoryProvider } from './HistoryContext';
export { useHistory } from './HistoryHooks';
export { UndoButton, RedoButton, HistoryButtons } from './HistoryButtons';

/**
 * @module HistoryService
 * @requires AutoSaveService
 * 
 * ## Setup
 * - Requires HistoryProvider to be the top-level parent. All history actions must be
 * performed in a descendent of HistoryProvider.
 * 
 * ## Usage
 * - Use the hook useHistory() to interact with the stored history.
 * - You can use UndoButton and RedoButton, but these are simply pure components for
 * easy access/testing. They do not implement any history logic.
 */
