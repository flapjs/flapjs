import React from 'react';

import { userClearGraph } from 'src/components/UserUtil';
import { CTRL_KEY } from 'src/session/manager/hotkey/HotKeyManager';

import FSAGraph from './graph/FSAGraph';
import FSAGraphController from './graph/FSAGraphController';
import MachineController from './machine/MachineController';

import StringTester from './tester/StringTester';
import FSAErrorChecker from './FSAErrorChecker';
import { registerNotifications } from './components/notifications/FSANotifications';

import * as FSAGraphParser from './FSAGraphParser';
import FSAImporter from './filehandlers/FSAImporter';
import FSAJFFImporter from './filehandlers/FSAJFFImporter';
import FSAExporter from './filehandlers/FSAExporter';
import FSAJFFExporter from './filehandlers/FSAJFFExporter';
import { registerImageExporters } from 'src/modules/nodegraph/filehandlers/NodalGraphImageExporter';

import SafeGraphEventHandler from 'src/modules/nodegraph/SafeGraphEventHandler';

import FSABroadcastHandler from './FSABroadcastHandler';
import TutorialHandler from './TutorialHandler';

/* COMPONENTS */

import PanelContainer from 'src/components/panels/PanelContainer';

import OverviewPanel from './components/panels/overview/OverviewPanel';
import TestingPanel from './components/panels/testing/TestingPanel';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel';

import { Playground } from './Playground';
import { Init } from './Init';
import { LocaleString } from 'src/libs/i18n';
import InputController from 'src/graph2/controller/InputController';

const MODULE_NAME = 'fsa';
const MODULE_VERSION = '3.0.0';

class FSAModule {

  static get moduleId() {
    return 'fsa';
  }

  static get moduleVersion() {
    return '5.0.0';
  }

  static get renderers() {
    return [
      { render: Init, on: 'init' },
      { render: Playground, on: 'playground' },
    ];
  }

  constructor(app) {
    this._app = app;

    this._graph = new FSAGraph();
    this._graphController = new FSAGraphController(app, this._graph, null);
    this._graphViewComponent = React.createRef();

    this._machineController = new MachineController(this);

    this._inputController = new InputController();

    this._errorChecker = new FSAErrorChecker(
      app,
      this._graphController,
      this._machineController
    );
    this._tester = new StringTester();
    this._testMode = false;

    this._broadcastHandler = new FSABroadcastHandler();
    this._tutorialHandler = new TutorialHandler();
  }

  /** @override */
  initialize(app) {
    registerNotifications(app.getNotificationManager());

    // TODO: These should have a pre/post handlers...
    app
      .getExportManager()
      .registerExporter(new FSAExporter(FSAGraphParser.JSON), 'session')
      .registerExporter(new FSAJFFExporter(FSAGraphParser.XML), 'jflap');

    registerImageExporters(app.getExportManager());

    app
      .getImportManager()
      .addImporter(
        new FSAImporter(app, FSAGraphParser.JSON),
        '.fsa.json',
        '.json'
      )
      .addImporter(new FSAJFFImporter(app, FSAGraphParser.XML), '.jff');

    app
      .getUndoManager()
      .setEventHandlerFactory(
        (...args) =>
          new SafeGraphEventHandler(this._graphController, FSAGraphParser.JSON)
      );

    app
      .getDrawerManager()
      .addPanelClass((props) => (
        <PanelContainer
          id={props.id}
          className={props.className}
          style={props.style}
          unlocalizedTitle="Finite State Automata">
          <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
          <p>{'<- Tap on a tab to begin!'}</p>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              marginRight: '1em',
            }}>
            {"Looking for Bab's Tutorial?"}
            <div style={{ display: 'flex', margin: '0.5em 0' }}>
              <button
                style={{ flex: 1 }}
                onClick={(e) => {
                  app.getDrawerComponent().closeDrawer();
                  this._tutorialHandler.start(app, true);
                }}>
                <LocaleString entity="message.action.next"/>
              </button>
            </div>
          </div>
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

    app.getMenuManager().setSubtitleComponentClass((props) => (
      <select
        onChange={(e) => {
          this._machineController.setMachineType(e.target.value);
        }}
        value={this._machineController.getMachineType()}>
        <option value="DFA">DFA</option>
        <option value="NFA">NFA</option>
      </select>
    ));

    app
      .getTooltipManager()
      .addTooltip(app.getLocale().getLocaleString('message.workspace.empty'))
      .addTooltip("If you need help, try the '?' at the top.")
      .addTooltip('Or you can choose to do nothing.')
      .addTooltip("I can't do anything about that.")
      .addTooltip(
        'You really should consider doing something though, for the sake of both of us.'
      )
      .addTooltip('Of course, it is your free will.')
      .addTooltip('You do you.')
      .addTooltip('Please do something.')
      .addTooltip('I need my job.')
      .addTooltip(app.getLocale().getLocaleString('message.workspace.empty'));

    app.getBroadcastManager().addMessageHandler(this._broadcastHandler);

    this._machineController.initialize(this);
    this._graphController.initialize();

    this._tutorialHandler.start(app);
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
  getBroadcastHandler() {
    return this._broadcastHandler;
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
    return 'Finite Automata';
  }
  /** @override */
  getApp() {
    return this._app;
  }
}

export default FSAModule;
