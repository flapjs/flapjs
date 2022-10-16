import React from 'react';

import GraphView from "src/graph2/components/GraphView";
import NodeGraphOverlayLayer from "./components/layers/NodeGraphOverlayLayer";
import NodeGraphLayer from "./components/layers/NodeGraphLayer";

export function Playground({ app, module }) {
    return (
        <GraphView
          ref={module._graphViewComponent}
          inputController={module._inputController}
          renderGraph={(graphView) => (
            <NodeGraphLayer
              graphView={graphView}
              graphController={module._graphController}
              inputController={module._inputController}
              editable={true}
            />
          )}
          renderOverlay={(graphView) => (
            <NodeGraphOverlayLayer
              graphView={graphView}
              graphController={module._graphController}
              inputController={module._inputController}
              session={app.getSession()}
            />
          )}/>
    );
}
