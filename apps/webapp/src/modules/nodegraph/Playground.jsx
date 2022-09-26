import React from 'react';

import GraphView from "src/graph2/components/GraphView";
import NodeGraphOverlayLayer from "./components/layers/NodeGraphOverlayLayer";
import NodeGraphLayer from "./components/layers/NodeGraphLayer";

export function Playground({ app, module }) {
    return (
        <GraphView
          ref={module._graphViewComponent}
          renderGraph={(graphView) => (
            <NodeGraphLayer
              graphView={graphView}
              graphController={module._graphController}
              editable={true}
            />
          )}
          renderOverlay={(graphView) => (
            <NodeGraphOverlayLayer
              graphView={graphView}
              graphController={module._graphController}
              session={app.getSession()}
            />
          )}/>
    );
}
