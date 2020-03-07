import AbstractInputHandler from '@flapjs/deprecated/services/graph/input/AbstractInputHandler.js';
import { EVENT_SOURCE_NODE } from '@flapjs/deprecated/services/graph/components/renderer/NodeRenderer.jsx';

export const GRAPH_EVENT_NODE_ACCEPT_CHANGE = 'node-accept-change';

class PDANodeInputHandler extends AbstractInputHandler
{
    constructor(inputController, graphController)
    {
        super();

        this._inputController = inputController;
        this._graphController = graphController;
    }

    /** @override */
    onDblInputEvent(pointer)
    {
        const inputController = this._inputController;
        const graphController = this._graphController;
        const currentTargetType = inputController.getCurrentTargetType();
        if (currentTargetType === EVENT_SOURCE_NODE)
        {
            const currentTargetSource = inputController.getCurrentTargetSource();
            currentTargetSource.setNodeAccept(!currentTargetSource.getNodeAccept());

            graphController.emitGraphEvent(GRAPH_EVENT_NODE_ACCEPT_CHANGE, { target: currentTargetSource });
        }
    }
}

export default PDANodeInputHandler;
