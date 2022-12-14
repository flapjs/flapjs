import React from 'react';
import './TestTray.css';

import IconButton from 'src/app/deprecated/icons/IconButton';
import PlayIcon from 'src/app/deprecated/icons/PlayIcon';
import PauseIcon from 'src/app/deprecated/icons/PauseIcon';
import StopIcon from 'src/app/deprecated/icons/StopIcon';
import UndoIcon from 'src/app/deprecated/icons/UndoIcon';
import RedoIcon from 'src/app/deprecated/icons/RedoIcon';

const MAX_STRING_PREV_LENGTH = 2;
const MAX_ELLIPSIS_COUNT = 3;

class TestTray extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const graphController = this.props.graphController;
        const tester = this.props.tester;
        const testList = this.props.tester.inputList;
        const testMode = this.props.tester.testMode;
        const testInput = testList.getCurrentInput();
        const testIndex = testMode.getCurrentTestStringIndex();

        return <div className="test-tray-container">
            <div className="test-tray-input-string-container">
                {
                    testInput && testIndex >= 0 &&
        testInput.value.split('').map((e, i) => 
        {
            const testOffset = testIndex - i;
            if (testOffset > MAX_ELLIPSIS_COUNT + MAX_STRING_PREV_LENGTH) return;
            if (testOffset > MAX_STRING_PREV_LENGTH)
            {
                return <span key={e + '.' + i} className="test-tray-input-placeholder">.</span>;
            }
            return <span key={e + '.' + i}
                className={'test-tray-input-char' +
            (testIndex == i ? ' active' : '')}>
                {e}
            </span>;
        })
                }
            </div>
            <div className="test-tray-control">

                <IconButton onClick={(e)=>
                {
                    testMode.onResume();
                }} disabled={testMode.isRunning()}>
                    <PlayIcon/>
                </IconButton>

                <IconButton onClick = {(e)=>
                {
                    testMode.onPause();
                }} disabled={!testMode.isRunning()}>
                    <PauseIcon/>
                </IconButton>

                <IconButton onClick = {(e)=>
                {
                    testMode.onPreviousStep();
                    /*if (testMode.targets.length > 0)
          {
            graphController.focusOnNodes(testMode.targets);
          }*/
                }} disabled={!testMode.hasPrevStep() || testMode.isSkipping()}>
                    <UndoIcon/>
                </IconButton>

                <IconButton onClick = {(e)=>
                {
                    testMode.onNextStep();
                    /*if (testMode.targets.length > 0)
          {
            graphController.focusOnNodes(testMode.targets);
          }*/
                }} disabled={!tester.testMode.hasNextStep() || testMode.isSkipping()}>
                    <RedoIcon/>
                </IconButton>

                <IconButton onClick={(e)=>
                {
                    tester.setStepByStepMode(false);
                }}>
                    <StopIcon/>
                </IconButton>

                <div className="trash-placeholder">{/*PLACEHOLDER for TRASH*/}</div>
            </div>
        </div>;
    }
}

export default TestTray;
