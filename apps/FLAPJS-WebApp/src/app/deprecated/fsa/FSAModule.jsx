import AbstractModule from 'src/app/deprecated/modules/abstract/AbstractModule';

import Notifications from 'src/app/deprecated/system/notification/Notifications';

import OverviewPanel from './panels/overview/OverviewPanel';
import TestingPanel from './panels/testing/TestingPanel';
import AnalysisPanel from './panels/analysis/AnalysisPanel';
import AboutPanel from './panels/about/AboutPanel';

import InputController from './controller/InputController';
import GraphController from './controller/GraphController';
import MachineController from './controller/MachineController';

import FSAGraphRenderer from './renderer/FSAGraphRenderer';
import FSAGraphOverlayRenderer from './renderer/FSAGraphOverlayRenderer';
import ViewportRenderer from './renderer/ViewportRenderer';

import LabelEditor from './editor/LabelEditor';
import TestingManager from './testing/TestingManager';

import SafeGraphEventHandler from 'src/app/deprecated/system/undomanager/SafeGraphEventHandler';

const VERSION = '0.0.1';
const PANELS = [AboutPanel, TestingPanel, OverviewPanel, AnalysisPanel];

class FSAModule extends AbstractModule
{
    constructor(app)
    {
        super(app);

        this._workspace = null;

        this._undoManager = app.getUndoManager();

        this._inputController = new InputController(this, app.getInputAdapter());
        this._graphController = new GraphController(this);
        this._machineController = new MachineController(this);

        //Deprecated (should be anyways)
        //this._eventManager = new EventManager(app.getUndoManager());
        //Deprecated
        this._testingManager = new TestingManager();
    }

    /** @override */
    initialize(app)
    {
        const viewport = app.viewport;
        const workspace = app.workspace;

        this._workspace = workspace;

        super.initialize(app);

        app.getUndoManager()
            .setEventHandlerFactory((...args) => 
            {
                return new SafeGraphEventHandler(this._graphController);
            });

        //this._eventManager.initialize(this);

        this._testingManager.initialize(this, viewport);

        //Notify on create in delete mode
        const tryCreateWhileTrash = () => 
        {
            if (this._inputController.isTrashMode())
            {
                Notifications.addMessage(I18N.toString('message.warning.cannotmodify'), 'warning', 'tryCreateWhileTrash');
            }
        };
        this._graphController.on('tryCreateWhileTrash', tryCreateWhileTrash);
    }

    /** @override */
    destroy(app)
    {
        this._testingManager.destroy();

        //this._eventManager.destroy();

        super.destroy(app);
    }

    /** @override */
    update(app)
    {
        super.update(app);
    }

    captureGraphEvent()
    {
        this._undoManager.captureEvent(new SafeGraphEventHandler(this._graphController));
    }

    getGraph()
    {
        return this._graphController.getGraph();
    }

    getTestingManager()
    {
        return this._testingManager;
    }

    getLabelEditor()
    {
        return LabelEditor;
    }

    /** @override */
    getRenderer(renderLayer)
    {
        switch (renderLayer)
        {
        case 'graph':
            return FSAGraphRenderer;
        case 'graphoverlay':
            return FSAGraphOverlayRenderer;
        case 'viewport':
            return ViewportRenderer;
        }
        return null;
    }
    /** @override */
    getInputController() { return this._inputController; }
    /** @override */
    getGraphController() { return this._graphController; }
    /** @override */
    getMachineController() { return this._machineController; }
    /** @override */
    getModuleVersion() { return VERSION; }
    /** @override */
    getModulePanels() { return PANELS; }
    /** @override */
    getModuleName() { return 'fsa'; }
    /** @override */
    getLocalizedModuleName() { return this._machineController.getMachineType(); }
}
export default FSAModule;
