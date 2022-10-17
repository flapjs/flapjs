import React from 'react';
import Style from './ViewportEditLayer.module.css';

import TrashCanWidget from '../widgets/TrashCanWidget';
import { LocaleConsumer } from 'src/libs/i18n';

export default class ViewportEditLayer extends React.Component {
  constructor(props) {
    super(props);

    this.onTrashChange = this.onTrashChange.bind(this);
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

  /** @override */
  render() {
    const graphController = this.props.graphController;
    const viewport = this.props.viewport;
    const graph = graphController.getGraph();

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
            {this.props.children}
          </div>
        )}
      </LocaleConsumer>
    );
  }
}
