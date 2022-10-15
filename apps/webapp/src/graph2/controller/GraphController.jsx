import { DEFAULT_LABEL_FORMATTER } from './LabelFormatter';

import GraphChangeHandler from './GraphChangeHandler';

import GraphNode from 'src/graph2/element/GraphNode';
import GraphEdge from 'src/graph2/element/GraphEdge';

export const GRAPH_EVENT_CLEAR = 'graph-clear';

class GraphController {
  /**
   * @param {import('../NodeGraph.js').default} graph 
   */
  constructor(graph) {
    this._graph = graph;
    this._graphChangeHandler = new GraphChangeHandler();

    this._labelEditor = null;
    this._labelFormatter = null;

    this._listeners = [];
    this._targets = [];
  }

  setLabelEditor(labelEditor) {
    this._labelEditor = labelEditor;
    return this;
  }

  setLabelFormatter(labelFormatter) {
    this._labelFormatter = labelFormatter;
    return this;
  }

  addListener(listener) {
    this._listeners.push(listener);
    return this;
  }

  removeListener(listener) {
    const index = this._listeners.indexOf(listener);
    if (index >= 0) this._listeners.splice(index, 1);
  }

  clearListeners() {
    this._listeners.length = 0;
  }

  initialize() {}

  update() {
    if (this._graphChangeHandler) {
      this._graphChangeHandler.update(this._graph);
    }
  }

  destroy() {}

  clearGraph() {
    this._graph.clear();
    this.emitGraphEvent(GRAPH_EVENT_CLEAR);
  }

  onGraphEvent(eventName, eventData) {
    // Do nothing... for now...
  }

  emitGraphEvent(eventName, eventData = {}) {
    this.onGraphEvent(eventName, eventData);

    for (const listener of this._listeners) {
      listener.onGraphEvent(this, eventName, eventData);
    }
  }

  openLabelEditor(target, defaultLabel = null, callback = null) {
    if (!this._labelEditor) {
      if (callback) callback(target, defaultLabel, false);
      return;
    }

    const labelEditor = this._labelEditor;
    const prevLabel = defaultLabel || '';
    labelEditor.openEditor(
      target,
      defaultLabel,
      (target, value) => {
        const hasChanged =
          !prevLabel || (prevLabel.length > 0 && value !== prevLabel);
        if (target instanceof GraphEdge) {
          target.setEdgeLabel(value);
        } else if (target instanceof GraphNode) {
          target.setNodeLabel(value);
        }

        if (callback) callback(target, value, hasChanged);
      },
      (target) => {
        if (callback) callback(target, null, false);
      }
    );
  }

  getLabelFormatter() {
    return this._labelFormatter || DEFAULT_LABEL_FORMATTER;
  }
  getLabelEditor() {
    return this._labelEditor;
  }

  getGraphChangeHandler() {
    return this._graphChangeHandler;
  }
  getGraph() {
    return this._graph;
  }

  getTargets() {
    return this._targets;
  }
  addTarget(target) {
    this._targets.push(target);
  }
  removeTarget(target) {
    let i = this._targets.indexOf(target);
    this._targets.splice(i, 1);
  }
  clearTargets() {
    this._targets.length = 0;
  }
}

export default GraphController;
