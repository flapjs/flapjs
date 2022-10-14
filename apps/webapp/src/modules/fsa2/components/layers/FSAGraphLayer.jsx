import React from 'react';

import GraphNodeLayer from 'src/graph2/components/layers/GraphNodeLayer';
import GraphEdgeLayer from 'src/graph2/components/layers/GraphEdgeLayer';
import SelectionBoxLayer from 'src/graph2/components/layers/SelectionBoxLayer';
import IndexedGraphStartMarkerLayer from 'src/graph2/components/layers/IndexedGraphStartMarkerLayer';
import GraphHighlightLayer from 'src/graph2/components/layers/GraphHighlightLayer';

import FSANodeRenderer from '../../graph/renderer/FSANodeRenderer';
import FSANodeInputHandler from '../../graph/inputhandler/FSANodeInputHandler';

import FSAEdgeRenderer from '../../graph/renderer/FSAEdgeRenderer';
import FSANode from '../../graph/element/FSANode';
import FSAEdge from '../../graph/element/FSAEdge';

class FSAGraphLayer extends React.Component {
  constructor(props) {
    super(props);

    const graphView = props.graphView;
    const graphController = props.graphController;
    const inputController = graphView.getInputController();

    this._fsaNodeInputHandler = new FSANodeInputHandler(
      inputController,
      graphController
    );
  }

  /** @override */
  componentDidMount() {
    const graphView = this.props.graphView;
    const inputContext = graphView.getInputContext();
    inputContext.addInputHandler(this._fsaNodeInputHandler);
  }

  /** @override */
  componentWillUnmount() {
    const graphView = this.props.graphView;
    const inputContext = graphView.getInputContext();
    inputContext.removeInputHandler(this._fsaNodeInputHandler);
  }

  /** @override */
  render() {
    const graphView = this.props.graphView;
    const graphController = this.props.graphController;
    const editable = this.props.editable;

    const graph = graphController.getGraph();
    const inputController = graphView.getInputController();
    const inputContext = graphView.getInputContext();

    const session = this.props.session;
    const testTargetNodes = session.getCurrentModule()._tester.targets;

    return (
      <React.Fragment>
        <IndexedGraphStartMarkerLayer
          inputController={inputController}
          graphController={graphController}
          inputContext={inputContext}
          inputPriority={-1}
          editable={editable}
        />
        <GraphNodeLayer
          nodes={graph.getNodes()}
          inputController={inputController}
          graphController={graphController}
          nodeRenderer={FSANodeRenderer}
          inputContext={inputContext}
          inputPriority={-1}
          editable={editable}
        />
        <GraphEdgeLayer
          ref={(ref) => {
            if (!ref) return;
            ref
              .getGraphEdgeInputHandler()
              .setShouldDeleteEdgeWithEmptyLabel(true)
              .setShouldDeleteEdgePlaceholder(true);
          }}
          edges={graph.getEdges()}
          inputController={inputController}
          graphController={graphController}
          edgeRenderer={FSAEdgeRenderer}
          inputContext={inputContext}
          inputPriority={-1}
          editable={editable}
        />
        <SelectionBoxLayer
          inputController={inputController}
          graphController={graphController}
          inputContext={inputContext}
          inputPriority={-1}
        />
        <GraphHighlightLayer nodes={testTargetNodes} />
        <GraphHighlightLayer
          nodes={graphController.getTargets().filter(n => n instanceof FSANode)}
          edges={graphController.getTargets().filter(n => n instanceof FSAEdge)} />
        
      </React.Fragment>
    );
  }
}

export default FSAGraphLayer;
