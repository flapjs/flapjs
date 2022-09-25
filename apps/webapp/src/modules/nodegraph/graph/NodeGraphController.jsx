import GraphController from 'src/graph2/controller/GraphController';

import { GRAPH_EVENT_NODE_EDIT_WHILE_DELETE } from 'src/graph2/inputhandler/GraphNodeInputHandler';
import { GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE } from 'src/graph2/inputhandler/GraphEdgeInputHandler';

import { WARNING_LAYOUT_ID } from 'src/session/manager/notification/NotificationManager';

export const TRASH_EDITING_NOTIFICATION_TAG = 'tryCreateWhileTrash';

class NodeGraphController extends GraphController
{
    constructor(app, graph)
    {
        super(graph);

        this._app = app;
    }

    /** @override */
    onGraphEvent(eventName, eventData)
    {
        super.onGraphEvent(eventName, eventData);

        switch (eventName)
        {
        case GRAPH_EVENT_NODE_EDIT_WHILE_DELETE:
        case GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE:
            this._app.getNotificationManager().pushNotification(
                I18N.toString('message.warning.cannotmodify'),
                WARNING_LAYOUT_ID, TRASH_EDITING_NOTIFICATION_TAG, null, true);
            break;
        default:
            this._app.getUndoManager().captureEvent();
        }
    }
	
    getApp() { return this._app; }
}

export default NodeGraphController;