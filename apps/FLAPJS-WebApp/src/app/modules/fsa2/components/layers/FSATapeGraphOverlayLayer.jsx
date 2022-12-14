import React from 'react';

import TapeWidget from '../widgets/TapeWidget';

import ViewportNavigationLayer from 'src/app/graph2/components/layers/ViewportNavigationLayer';

class FSATapeGraphOverlayLayer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const graphView = this.props.graphView;
        const tester = this.props.tester;

        return (
            <React.Fragment>
                <ViewportNavigationLayer
                    style={{ right: 0 }}
                    viewportAdapter={graphView.getViewportAdapter()} />
                <TapeWidget style={{ position: 'absolute', bottom: 0 }}
                    value={tester ? tester.getTapeContext() : null} />
            </React.Fragment>
        );
    }
}

export default FSATapeGraphOverlayLayer;