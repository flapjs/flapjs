import React from 'react';

import FSAGraphLayer from './components/layers/FSAGraphLayer';
import FSAGraphOverlayLayer from './components/layers/FSAGraphOverlayLayer';
import FSATapeGraphOverlayLayer from './components/layers/FSATapeGraphOverlayLayer';

import GraphView from 'src/graph2/components/GraphView';

export function Playground({ app, module }) {
  return (
    <GraphView
      ref={module._graphViewComponent}
      renderGraph={(graphView) => {
        return (
          <FSAGraphLayer
            graphView={graphView}
            graphController={module._graphController}
            editable={!module._testMode}
            session={app.getSession()}
          />
        );
      }}
      renderOverlay={(graphView) => {
        if (!module._testMode) {
          return (
            <FSAGraphOverlayLayer
              graphView={graphView}
              graphController={module._graphController}
              session={app.getSession()}
            />
          );
        } else {
          return (
            <FSATapeGraphOverlayLayer
              graphView={graphView}
              tester={module._tester}
            />
          );
        }
      }} />
  );
}
