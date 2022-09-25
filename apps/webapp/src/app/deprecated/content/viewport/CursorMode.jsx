import React from 'react';
import './CursorMode.css';

import IconButton from 'src/app/deprecated/icons/IconButton';
import CreateIcon from 'src/assets/icons/pencil.svg';
import MoveIcon from 'src/assets/icons/move.svg';

class CursorMode extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const inputController = this.props.inputController;
    const graphController = this.props.graphController;
    const actionMode = inputController.isActionMode();

    return <div id="cursor-btn">
      <IconButton id="action-mode" className={actionMode ? "active" : ""}
        onClick={() => inputController.setInputScheme(true)}
        title={I18N.toString("cursor.actionmode")}>
        <CreateIcon/>
      </IconButton>
      <IconButton id="move-mode" className={!actionMode ? "active" : ""}
        onClick={() => inputController.setInputScheme(false)}
        title={I18N.toString("cursor.movemode")}>
        <MoveIcon/>
      </IconButton>
    </div>;
  }
}

export default CursorMode;
