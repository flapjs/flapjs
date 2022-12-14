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

import FSABroadcastHandler from './FSABroadcastHandler';

/* COMPONENTS */

import OverviewPanel from './components/panels/overview/OverviewPanel';
import TestingPanel from './components/panels/testing/TestingPanel';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel';

import { Playground } from './Playground';
import { Init } from './Init';
import InputController from 'src/graph2/controller/InputController';

import { AppBar } from './AppBar';
import { MenuBar } from './MenuBar';
import { AboutPanel, DrawerTab } from 'src/components/drawer/DrawerView';
import ExportPanel from 'src/components/appbar/menus/export/ExportPanel';
import OptionPanel from 'src/components/appbar/menus/option/OptionPanel';
import LanguagePanel from 'src/components/appbar/menus/language/LanguagePanel';
import ModuleLoaderPanel from 'src/components/appbar/menus/moduleloader/ModuleLoaderPanel';
import { AboutMenu } from 'src/components/appbar/toolbar/ToolbarView';
import { DeterminismToggle } from './DeterminismToggle';
import { useSerDes } from './FSASerializer';

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
      { render: AppBar, props: { useSerDes }, on: 'appbar' },
      { render: MenuBar, on: 'menubar' },
      { render: DeterminismToggle, on: 'appbar.subtitle' },
      // NOTE: Order matters! Each tab will match the drawer by index.
      { render: AboutPanel, props: { unlocalized: 'Finite Automata' }, on: 'drawer' },
      { render: OverviewPanel, on: 'drawer' },
      { render: TestingPanel, on: 'drawer' },
      { render: AnalysisPanel, on: 'drawer' },
      { render: DrawerTab, props: { hidden: true }, on: 'drawer.tab' },
      { render: DrawerTab, props: { unlocalized: 'component.overview.title' }, on: 'drawer.tab' },
      { render: DrawerTab, props: { unlocalized: 'component.testing.title' }, on: 'drawer.tab' },
      { render: DrawerTab, props: { unlocalized: 'component.analysis.title' }, on: 'drawer.tab' },
      { render: AboutMenu, on: 'menu' },
      { render: ModuleLoaderPanel, on: 'menu' },
      { render: LanguagePanel, on: 'menu' },
      { render: OptionPanel, on: 'menu' },
      { render: ExportPanel, on: 'menu' },
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
      .getHotKeyManager()
      .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => {
        app.getExportManager().tryExportFile('image-png', app.getSession());
      })
      .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => {
        app.getExportManager().tryExportFile('session', app.getSession());
      });

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
