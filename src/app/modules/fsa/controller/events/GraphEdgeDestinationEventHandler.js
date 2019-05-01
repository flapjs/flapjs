import EventHandler from './EventHandler.js';

class GraphEdgeDestinationEventHandler extends EventHandler
{
    constructor(eventLogger, graphController)
    {
        super(eventLogger, graphController, 'edgeDestination');
    }

    /** @override */
    captureEvent(graph, targetEdge, nextDestination, prevDestination, prevQuad)
    {
        return {
            graph: graph,
            edgeID: targetEdge.getGraphElementID(),
            nextDestination: nextDestination,
            prevDestination: prevDestination,
            nextQuad: Object.assign({}, targetEdge.getQuadratic()),
            prevQuad: Object.assign({}, prevQuad),
        };
    }

    /** @override */ - this = event
    applyUndo(e)
    {
        const graph = this.controller.getGraph();
        const edge = graph.getEdgeByElementID(e.eventData.edgeID);
        if (!edge) throw new Error('Unable to find target in graph');

        let radians = e.eventData.prevQuad.radians;
        const length = e.eventData.prevQuad.length;

        edge.changeDestinationNode(e.eventData.prevDestination);
        //Flip them, since self loops are upside down
        if (edge.isSelfLoop()) radians = -radians;
        edge.setQuadratic(radians, length);
    }

    /** @override */ - this = event
    applyRedo(e)
    {
        const graph = this.controller.getGraph();
        const edge = graph.getEdgeByElementID(e.eventData.edgeID);
        if (!edge) throw new Error('Unable to find target in graph');

        let radians = e.eventData.nextQuad.radians;
        const length = e.eventData.nextQuad.length;

        edge.changeDestinationNode(e.eventData.nextDestination);
        edge.setQuadratic(radians, length);
    }
}
export default GraphEdgeDestinationEventHandler;
