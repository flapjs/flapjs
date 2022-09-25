import EventHandler from './EventHandler';

import * as FSAGraphParser from 'src/app/deprecated/fsa/graph/FSAGraphParser';

class SafeGraphEventHandler extends EventHandler
{
    constructor(eventLogger, graphController, eventName, postEventName)
    {
        super(eventLogger, graphController, eventName, postEventName);
    }

    /** @override */
    captureEvent(graph)
    {
        return {
            graphData: FSAGraphParser.JSON.objectify(graph)
        };
    }

    /** @override */
    capturePostEvent(graph)
    {
        return {
            graphData: FSAGraphParser.JSON.objectify(graph)
        };
    }

    //Override - this = event
    applyUndo(e)
    {
        FSAGraphParser.JSON.parse(e.eventData.graphData, this.controller.getGraph());
    }

    //Override - this = event
    applyRedo(e)
    {
        FSAGraphParser.JSON.parse(e.postData.graphData, this.controller.getGraph());
    }
}
export default SafeGraphEventHandler;
