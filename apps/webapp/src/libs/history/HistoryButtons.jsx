import React from 'react';

import UndoIcon from 'src/assets/icons/undo.svg';
import RedoIcon from 'src/assets/icons/redo.svg';
import { useHistory } from './HistoryHooks';
import IconButton from 'src/components/IconButton';

/**
 * @param {object} props 
 * @param {React.MouseEventHandler} props.onClick
 * @param {() => boolean} props.canClick
 * @param {string} [props.title]
 */
export function UndoButton(props) {
    const { onClick, canClick, title="Undo" } = props;
    return (
        <IconButton
            onClick={onClick}
            disabled={!canClick()}
            title={title}>
            <UndoIcon/>
        </IconButton>
    );
}

/**
 * @param {object} props 
 * @param {React.MouseEventHandler} props.onClick
 * @param {() => boolean} props.canClick
 * @param {string} [props.title]
 */
export function RedoButton(props) {
    const { onClick, canClick, title="Redo" } = props;
    return (
        <IconButton
            onClick={onClick}
            disabled={!canClick()}
            title={title}>
            <RedoIcon/>
        </IconButton>
    );
}

/**
 * @param {object} props
 * @param {import('./HistoryHooks').SerializerFunction} props.serializer
 * @param {import('./HistoryHooks').DeserializerFunction} props.deserializer
 * @param {string} [props.historyKey]
 * @param {string} [props.undoTitle]
 * @param {string} [props.redoTitle]
 */
export function HistoryButtons(props) {
    const {
        serializer,
        deserializer,
        historyKey = 'app.history',
        undoTitle,
        redoTitle,
    } = props;
    const {
        doUndoHistory,
        canUndoHistory,
        doRedoHistory,
        canRedoHistory,
    } = useHistory(historyKey, serializer, deserializer);
    return (
        <>
        <UndoButton onClick={doUndoHistory} canClick={canUndoHistory} title={undoTitle}/>
        <RedoButton onClick={doRedoHistory} canClick={canRedoHistory} title={redoTitle}/>
        </>
    );
}
