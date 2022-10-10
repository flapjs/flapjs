import React from 'react';
import Style from './ViewportEditLayer.module.css';

import TrashCanWidget from '../widgets/TrashCanWidget';
import ModeTrayWidget, {
  MODE_ACTION,
  MODE_MOVE,
} from '../widgets/ModeTrayWidget';
import { LocaleConsumer } from 'src/libs/i18n';

class ViewportEditLayer extends React.Component {
  constructor(props) {
    super(props);

    this.onTrashChange = this.onTrashChange.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
  }

  onTrashChange(flag) {
    this.props.inputController.setTrashMode(flag);
    if (flag) {
      this.props.session
        .getApp()
        .getDrawerComponent()
        .setViewportColor('var(--color-viewport-error)');
    } else {
      this.props.session.getApp().getDrawerComponent().setViewportColor(null);
    }
  }

  onModeChange(value) {
    this.props.inputController.setMoveModeFirst(value === MODE_MOVE);
  }

  /** @override */
  render() {
    const inputController = this.props.inputController;
    const graphController = this.props.graphController;
    const viewport = this.props.viewport;
    const graph = graphController.getGraph();

    let moveMode = null;
    if (inputController) {
      if (inputController.isHandlingInput()) {
        moveMode = inputController.isMoveMode(viewport.getInputAdapter())
          ? MODE_MOVE
          : MODE_ACTION;
      } else {
        moveMode = inputController.isMoveModeFirst() ? MODE_MOVE : MODE_ACTION;
      }
    }

    return (
      <LocaleConsumer>
        {locale => (
          <div
            id={this.props.id}
            className={Style.view_container + ' ' + this.props.className}
            style={this.props.style}>
            <TrashCanWidget
              className={Style.view_widget}
              style={{ bottom: 0, right: 0 }}
              visible={
                !graph.isEmpty() &&
                viewport &&
                (!viewport.getInputAdapter().isUsingTouch() ||
                  !viewport.getInputAdapter().isDragging())
              }
              onChange={this.onTrashChange}
              onClear={() => {
                if (window.confirm(locale.getLocaleString('alert.graph.clear'))) {
                  this.props.graphController.clearGraph();
                }
              }}
            />
            <ModeTrayWidget
              className={Style.view_widget}
              style={{ bottom: 0, left: 0 }}
              visible={inputController}
              mode={moveMode}
              onChange={this.onModeChange}
            />
            {this.props.children}
          </div>
        )}
      </LocaleConsumer>
    );
  }
}

export default ViewportEditLayer;
