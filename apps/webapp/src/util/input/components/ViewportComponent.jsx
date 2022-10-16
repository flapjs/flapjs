import React, { useRef } from 'react';
import Style from './ViewportComponent.module.css';

import ViewportAdapter from '../ViewportAdapter';
import InputAdapter from '../InputAdapter';
import AbstractInputHandler from '../AbstractInputHandler';

const DEFAULT_VIEW_SIZE = 300;
const SMOOTH_OFFSET_DAMPING = 0.4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

class ViewportComponent extends React.Component {
  constructor(props) {
    super(props);

    this._ref = React.createRef();

    this._viewportAdapter = new ViewportAdapter()
      .setMinScale(MIN_SCALE)
      .setMaxScale(MAX_SCALE)
      .setOffsetDamping(SMOOTH_OFFSET_DAMPING);
    this._inputAdapter = new InputAdapter(this._viewportAdapter);
  }

  addInputHandler(inputHandler) {
    if (!(inputHandler instanceof AbstractInputHandler))
      throw new Error(
        'input handler must be an instanceof AbstractInputHandler'
      );
    this._inputAdapter.addInputHandler(inputHandler);
    return this;
  }

  /** @override */
  componentDidMount() {
    this._inputAdapter.initialize(this._ref.current);
  }

  /** @override */
  componentWillUnmount() {
    this._inputAdapter.destroy();
  }

  /** @override */
  componentDidUpdate() {
    this._inputAdapter.update();
  }

  getSVGElement() {
    return this._ref.current;
  }

  getInputAdapter() {
    return this._inputAdapter;
  }

  getViewportAdapter() {
    return this._viewportAdapter;
  }

  /** @override */
  render() {
    const viewport = this._viewportAdapter;
    const baseViewSize = this.props.viewSize || DEFAULT_VIEW_SIZE;
    const viewSize =
      baseViewSize * Math.max(Number.MIN_VALUE, viewport.getScale());
    const halfViewSize = viewSize / 2;
    const viewBox = (
      -halfViewSize + ' ' + -halfViewSize + ' ' + viewSize + ' ' + viewSize
    );
    const transform = 'translate(' + viewport.getOffsetX() + ' ' + viewport.getOffsetY() + ')'

    return (
      <svg
        ref={this._ref}
        id={this.props.id}
        className={Style.viewport_component + ' ' + this.props.className}
        style={this.props.style}
        viewBox={viewBox}>
        <g transform={transform}>{this.props.children}</g>
      </svg>
    );
  }
}

export default ViewportComponent;
