import React from 'react';

import { userClearGraph } from 'src/components/UserUtil';
import { CTRL_KEY } from 'src/session/manager/hotkey/HotKeyManager';

import PDAGraph from './graph/PDAGraph';
import PDAGraphController from './graph/PDAGraphController';
import MachineController from './machine/MachineController';

import StringTester from './tester/StringTester';
import PDAErrorChecker from './PDAErrorChecker';
import { registerNotifications } from './components/notifications/PDANotifications';

import * as PDAGraphParser from './PDAGraphParser';
import PDAImporter from './filehandlers/PDAImporter';
import PDAExporter from './filehandlers/PDAExporter';
import { registerImageExporters } from 'src/modules/nodegraph/filehandlers/NodalGraphImageExporter';

import SafeGraphEventHandler from 'src/modules/nodegraph/SafeGraphEventHandler';

/* COMPONENTS */

import PanelContainer from 'src/components/panels/PanelContainer';

import OverviewPanel from './components/panels/overview/OverviewPanel';
import TestingPanel from './components/panels/testing/TestingPanel';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel';

import { Playground } from './Playground';

const MODULE_NAME = 'pda';
const MODULE_LOCALIZED_NAME = 'Pushdown Automata';
const MODULE_VERSION = '0.0.1';

class PDAModule {
  static get moduleId() {
    return 'pda';
  }

  static get moduleVersion() {
    return '2.0.0';
  }

  static get renderers() {
    return [
      { render: Playground, on: 'playground' },
    ];
  }

  constructor(app) {
    this._app = app;

    this._graph = new PDAGraph();
    this._graphController = new PDAGraphController(app, this._graph, null);
    this._graphViewComponent = React.createRef();

    this._machineController = new MachineController(this);

    this._errorChecker = new PDAErrorChecker(
      app,
      this._graphController,
      this._machineController
    );
    this._tester = new StringTester();
    this._testMode = false;
  }

  /** @override */
  initialize(app) {
    registerNotifications(app.getNotificationManager());

    app
      .getExportManager()
      .registerExporter(new PDAExporter(PDAGraphParser.JSON), 'session');

    registerImageExporters(app.getExportManager());

    app
      .getImportManager()
      .addImporter(
        new PDAImporter(app, PDAGraphParser.JSON),
        '.pda.json',
        '.json'
      );

    app
      .getUndoManager()
      .setEventHandlerFactory(
        (...args) =>
          new SafeGraphEventHandler(this._graphController, PDAGraphParser.JSON)
      );

    app
      .getDrawerManager()
      .addPanelClass((props) => (
        <PanelContainer
          id={props.id}
          className={props.className}
          style={props.style}
          title={'Pushdown Automata'}>
          <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
          <p>{'<- Tap on a tab to begin!'}</p>
        </PanelContainer>
      ))
      .addPanelClass(OverviewPanel)
      .addPanelClass(TestingPanel)
      .addPanelClass(AnalysisPanel);

    app
      .getHotKeyManager()
      .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => {
        app.getExportManager().tryExportFile('image-png', app.getSession());
      })
      .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => {
        app.getExportManager().tryExportFile('session', app.getSession());
      });

    this._machineController.initialize(this);
    this._graphController.initialize();
  }

  /** @override */
  update(app) {
    this._graphController.update();
    this._machineController.update(this);
  }

  /** @override */
  destroy(app) {
    this._machineController.destroy(this);
    this._graphController.destroy();
  }

  /** @override */
  clear(app, graphOnly = false) {
    userClearGraph(app, graphOnly, () => {
      let toolbar = app.getToolbarComponent();
      if (toolbar) {
        toolbar.closeBar();
      }
    });
  }

  getMachineController() {
    return this._machineController;
  }
  getGraphController() {
    return this._graphController;
  }
  getGraphView() {
    return this._graphViewComponent.current;
  }

  getErrorChecker() {
    return this._errorChecker;
  }
  getStringTester() {
    return this._tester;
  }

  /** @override */
  getModuleVersion() {
    return MODULE_VERSION;
  }
  /** @override */
  getModuleName() {
    return MODULE_NAME;
  }
  /** @override */
  getLocalizedModuleName() {
    return MODULE_LOCALIZED_NAME;
  }
  /** @override */
  getApp() {
    return this._app;
  }
}

export default PDAModule;
