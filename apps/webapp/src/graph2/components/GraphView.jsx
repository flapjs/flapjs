import React from 'react';

import ViewportComponent from 'src/util/input/components/ViewportComponent';

import InputController from 'src/graph2/controller/InputController';
import InputContext from 'src/util/input/InputContext';

import ViewportInputHandler from 'src/graph2/inputhandler/ViewportInputHandler';

class GraphView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._inputController = new InputController();
        this._inputContext = new InputContext();

        this._viewportComponent = React.createRef();

        this._viewportInputHandler = new ViewportInputHandler(this._inputController);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this._inputContext;
        const viewport = this._viewportComponent.current;
        const inputAdapter = viewport.getInputAdapter();
        inputContext
            .addInputHandler(this._inputController)
            .addInputHandler(this._viewportInputHandler, 10);
        inputAdapter.bindContext(inputContext);
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this._inputContext;
        const viewport = this._viewportComponent.current;
        const inputAdapter = viewport.getInputAdapter();
        inputContext.clearInputHandlers();
        inputAdapter.unbindContext(inputContext);
    }

    moveViewToPosition(x, y)
    {
        // Center view at position; inverted due to graph-to-screen space
        this.getViewportAdapter().setOffset(-x, -y);
    }

    getInputController() { return this._inputController; }
    getInputContext() { return this._inputContext; }

    getViewportComponent() { return this._viewportComponent.current; }
    getInputAdapter() { return this._viewportComponent.current.getInputAdapter(); }
    getViewportAdapter() { return this._viewportComponent.current.getViewportAdapter(); }

    /** @override */
    render()
    {
        const inputController = this._inputController;
        const viewport = this._viewportComponent.current;
        const renderGraph = this.props.renderGraph;
        const renderOverlay = this.props.renderOverlay;

        return (
            <div id={this.props.id}
                className={this.props.className}
                style={this.props.style}>
                <ViewportComponent ref={this._viewportComponent}>
                    {renderGraph && viewport && renderGraph(this, viewport, inputController)}
                </ViewportComponent>
                {renderOverlay && viewport && renderOverlay(this, viewport, inputController)}
            </div>
        );
    }
}

export default GraphView;
