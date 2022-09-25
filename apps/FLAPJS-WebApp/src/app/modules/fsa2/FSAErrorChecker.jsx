import { SUCCESS_LAYOUT_ID } from 'session/manager/notification/NotificationManager';
import
{
    MACHINE_ERROR_NOTIFICATION_TAG,
    STATE_LAYOUT_ID,
    TRANSITION_LAYOUT_ID,
    STATE_UNREACHABLE_LAYOUT_ID,
    STATE_MISSING_LAYOUT_ID
} from './components/notifications/FSANotifications';

import
{
    ERROR_UNREACHABLE_STATE,
    ERROR_DUPLICATE_STATE,
    ERROR_INCOMPLETE_TRANSITION,
    ERROR_DUPLICATE_TRANSITION,
    ERROR_MISSING_TRANSITION,
    ERROR_EMPTY_TRANSITION
} from './machine/FSABuilder';

class FSAErrorChecker
{
    constructor(app, graphController, machineController)
    {
        this._app = app;
        this._graphController = graphController;
        this._machineController = machineController;
        this._showErrorOnChange = false;

        this.onMachineChange = this.onMachineChange.bind(this);

        machineController.getMachineBuilder().getMachineChangeHandler().addListener(this.onMachineChange);
    }

    onMachineChange(machineBuilder)
    {
        if (this._showErrorOnChange)
        {
            this.showErrors();
        }
    }

    setErrorChecking(enabled)
    {
        this._showErrorOnChange = enabled;
    }

    isErrorChecking()
    {
        return this._showErrorOnChange;
    }

    showErrors()
    {
        const props = {
            graphController: this._graphController,
            machineController: this._machineController,
            app: this._app
        };
        const machineBuilder = this._machineController.getMachineBuilder();
        const errors = machineBuilder.getMachineErrors();
        const warnings = machineBuilder.getMachineWarnings();
        const app = this._app;
        const notificationManager = app.getNotificationManager();

        notificationManager.clearNotifications(MACHINE_ERROR_NOTIFICATION_TAG);
        if (errors.length <= 0 && warnings.length <= 0)
        {
            notificationManager.pushNotification(
                I18N.toString('message.error.none'),
                SUCCESS_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, null, false);
        }
        else
        {
            for (const warning of warnings)
            {
                switch (warning.name)
                {
                case ERROR_UNREACHABLE_STATE:
                    notificationManager.pushNotification(warning.nodes,
                        STATE_UNREACHABLE_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, props, false);
                    break;
                }
            }

            for (const error of errors)
            {
                switch (error.name)
                {
                case ERROR_DUPLICATE_STATE:
                    notificationManager.pushNotification({
                        text: 'Found duplicate nodes of similar names',
                        targets: error.nodes
                    }, STATE_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, props, false);
                    break;
                case ERROR_INCOMPLETE_TRANSITION:
                    notificationManager.pushNotification({
                        text: I18N.toString('message.error.incomplete'),
                        targets: error.edges
                    }, TRANSITION_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, props, false);
                    break;
                case ERROR_DUPLICATE_TRANSITION:
                    notificationManager.pushNotification({
                        text: I18N.toString('message.error.dupe'),
                        targets: error.edges
                    }, TRANSITION_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, props, false);
                    break;
                case ERROR_MISSING_TRANSITION:
                    notificationManager.pushNotification({
                        targets: [error.node],
                        symbol: error.symbols
                    }, STATE_MISSING_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, props, false);
                    break;
                case ERROR_EMPTY_TRANSITION:
                    notificationManager.pushNotification({
                        text: I18N.toString('message.error.empty'),
                        targets: error.edges
                    }, TRANSITION_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, props, false);
                    break;
                }
            }
        }
    }
}

export default FSAErrorChecker;
