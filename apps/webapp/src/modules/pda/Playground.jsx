import React from 'react';

import PDAGraphLayer from './components/layers/PDAGraphLayer';
import PDAGraphOverlayLayer from './components/layers/PDAGraphOverlayLayer';
import PDATapeGraphOverlayLayer from './components/layers/PDATapeGraphOverlayLayer';

import GraphView from 'src/graph2/components/GraphView';

export function Playground({ app, module }) {
    return (
        <GraphView
            ref={module._graphViewComponent}
            inputController={module._inputController}
            renderGraph={(graphView) => {
                return (
                    <PDAGraphLayer
                        graphView={graphView}
                        graphController={module._graphController}
                        inputController={module._inputController}
                        editable={!module._testMode}
                    />
                );
            }}
            renderOverlay={(graphView) => {
                if (!module._testMode) {
                    return (
                        <PDAGraphOverlayLayer
                            graphView={graphView}
                            graphController={module._graphController}
                            inputController={module._inputController}
                            session={app.getSession()}
                        />
                    );
                } else {
                    return (
                        <PDATapeGraphOverlayLayer
                            graphView={graphView}
                            inputController={module._inputController}
                            tester={module._tester}
                        />
                    );
                }
            }} />
    );
}
