import React from 'react';
import Style from './FocusCenterWidget.module.css';

import IconButton from 'src/components/IconButton';
import PinpointIcon from 'src/assets/icons/pinpoint.svg';

const OFFSET_EPSILON = 0.1;

class FocusCenterWidget extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    const viewportAdapter = this.props.viewportAdapter;
    viewportAdapter.setOffset(0, 0);
  }

  /** @override */
  render() {
    const viewportAdapter = this.props.viewportAdapter;

    return (
      <IconButton
        id={this.props.id}
        className={Style.center_focus_button + ' ' + this.props.className}
        style={this.props.style}
        title={'Center Workspace'}
        disabled={
          Math.abs(viewportAdapter.getOffsetX()) < OFFSET_EPSILON &&
          Math.abs(viewportAdapter.getOffsetY()) < OFFSET_EPSILON
        }
        onClick={this.onClick}>
        <PinpointIcon />
      </IconButton>
    );
  }
}

export default FocusCenterWidget;
