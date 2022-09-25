import GraphNodeInitialEventHandler from './controller/events/GraphNodeInitialEventHandler';
import GraphNodeMoveEventHandler from './controller/events/GraphNodeMoveEventHandler';
import GraphNodeMoveAllEventHandler from './controller/events/GraphNodeMoveAllEventHandler';
import GraphEdgeMoveEventHandler from './controller/events/GraphEdgeMoveEventHandler';
import GraphEdgeDestinationEventHandler from './controller/events/GraphEdgeDestinationEventHandler';
import GraphEdgeLabelEventHandler from './controller/events/GraphEdgeLabelEventHandler';

import UserCreateNodeEventHandler from './controller/events/UserCreateNodeEventHandler';
import UserToggleNodeEventHandler from './controller/events/UserToggleNodeEventHandler';
import UserDeleteNodesEventHandler from './controller/events/UserDeleteNodesEventHandler';
import UserRenameNodeEventHandler from './controller/events/UserRenameNodeEventHandler';

import UserCreateEdgeEventHandler from './controller/events/UserCreateEdgeEventHandler';
import UserDeleteEdgeEventHandler from './controller/events/UserDeleteEdgeEventHandler';
import UserImportGraphEventHandler from './controller/events/UserImportGraphEventHandler';
import SafeGraphEventHandler from './controller/events/SafeGraphEventHandler';

import UserChangeMachineEventHandler from './controller/events/UserChangeMachineEventHandler';
import UserConvertMachineEventHandler from './controller/events/UserConvertMachineEventHandler';
import UserRenameMachineEventHandler from './controller/events/UserRenameMachineEventHandler';
import UserRenameSymbolEventHandler from './controller/events/UserRenameSymbolEventHandler';
import UserDeleteSymbolEventHandler from './controller/events/UserDeleteSymbolEventHandler';

class EventManager
{
    constructor(undoManager)
    {
        this.graphController = null;
        this.machineController = null;

        this.eventHandlers = [];

        this.undoManager = undoManager;
    }

    initialize(module)
    {
        this.graphController = module.getGraphController();
        this.machineController = module.getMachineController();
        
        const events = this.undoManager;

        this.eventHandlers.push(new GraphNodeMoveEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphNodeMoveAllEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphEdgeMoveEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphEdgeDestinationEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphNodeInitialEventHandler(events, this.graphController));
        this.eventHandlers.push(new GraphEdgeLabelEventHandler(events, this.graphController));

        this.eventHandlers.push(new UserCreateNodeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserRenameNodeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserToggleNodeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserDeleteNodesEventHandler(events, this.graphController));

        this.eventHandlers.push(new UserCreateEdgeEventHandler(events, this.graphController));
        this.eventHandlers.push(new UserDeleteEdgeEventHandler(events, this.graphController));

        this.eventHandlers.push(new UserImportGraphEventHandler(events, this.graphController, this.machineController));
        this.eventHandlers.push(new SafeGraphEventHandler(events, this.graphController, 'userPreChangeLayout', 'userPostChangeLayout'));

        this.eventHandlers.push(new UserChangeMachineEventHandler(events, this.machineController));
        this.eventHandlers.push(new UserConvertMachineEventHandler(events, this.machineController, this.graphController));
        this.eventHandlers.push(new UserRenameMachineEventHandler(events, this.machineController));
        this.eventHandlers.push(new UserRenameSymbolEventHandler(events, this.machineController, this.graphController));
        this.eventHandlers.push(new UserDeleteSymbolEventHandler(events, this.machineController, this.graphController));
    }

    destroy()
    {
        for(const handler of this.eventHandlers)
        {
            handler.destroy();
        }

        //TODO: Remove all event listeners...
        this.graphController.clearEventListeners();
    }
}

export default EventManager;
