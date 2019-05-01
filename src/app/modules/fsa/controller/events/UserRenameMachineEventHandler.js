import EventHandler from './EventHandler.js';

class UserRenameMachineEventHandler extends EventHandler
{
    constructor(eventLogger, machineController)
    {
        super(eventLogger, machineController, 'userRenameMachine');
    }

    /** @override */
    captureEvent(machineBuilder, nextMachineName, prevMachineName)
    {
        return {
            prevName: prevMachineName,
            nextName: nextMachineName
        };
    }

    /** @override */ - this = event
    applyUndo(e)
    {
        this.controller.setMachineName(e.eventData.prevName);
    }

    /** @override */ - this = event
    applyRedo(e)
    {
        this.controller.setMachineName(e.postData.nextName);
    }
}
export default UserRenameMachineEventHandler;
