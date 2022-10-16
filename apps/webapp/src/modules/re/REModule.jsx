import React from 'react';
import PanelContainer from 'src/components/panels/PanelContainer';

import MachineController from './MachineController';
import REErrorChecker from './REErrorChecker';
import SafeExpressionEventHandler from './SafeExpressionEventHandler';

import { registerNotifications } from './components/notifications/RENotifications';

import OverviewPanel from './components/panels/overview/OverviewPanel';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel';
import TestingPanel from './components/panels/testing/TestingPanel';

import { CTRL_KEY, SHIFT_KEY } from 'src/session/manager/hotkey/HotKeyManager';

import REImporter from './filehandlers/REImporter';
import REExporter from './filehandlers/REExporter';
import REToFSAExporter from './filehandlers/REToFSAExporter';

import { Playground } from './Playground';
import { AppBar } from '../fsa2/AppBar';
import { MenuBar } from '../fsa2/MenuBar';
import { AboutPanel, DrawerTab } from 'src/components/drawer/DrawerView';

const MODULE_NAME = 're';
const MODULE_VERSION = '0.0.1';
const MODULE_LOCALIZED_NAME = 'RE';

class REModule {
  static get moduleId() {
    return 're';
  }

  static get moduleVersion() {
    return '1.0.0';
  }

  static get renderers() {
    return [
      { render: Playground, on: 'playground' },
      { render: AppBar, on: 'appbar' },
      { render: MenuBar, on: 'menubar' },
      // NOTE: Order matters! Each tab will match the drawer by index.
      { render: AboutPanel, props: { unlocalized: 'Regular Expression' }, on: 'drawer' },
      { render: OverviewPanel, on: 'drawer' },
      { render: TestingPanel, on: 'drawer' },
      { render: AnalysisPanel, on: 'drawer' },
      { render: DrawerTab, props: { hidden: true }, on: 'drawer.tab' },
      { render: DrawerTab, props: { unlocalized: 'component.overview.title' }, on: 'drawer.tab' },
      { render: DrawerTab, props: { unlocalized: 'component.testing.title' }, on: 'drawer.tab' },
      { render: DrawerTab, props: { unlocalized: 'component.analysis.title' }, on: 'drawer.tab' },
    ];
  }

  constructor(app) {
    this._app = app;

    this._machineController = new MachineController();
    this._errorChecker = new REErrorChecker(app, this._machineController);
  }

  /** @override */
  initialize(app) {
    registerNotifications(app.getNotificationManager());

    app
      .getUndoManager()
      .setEventHandlerFactory(
        (...args) => new SafeExpressionEventHandler(this._machineController)
      );

    app
      .getExportManager()
      .registerExporter(new REExporter(), 'session')
      .registerExporter(new REToFSAExporter(), 're2fsa');

    app
      .getImportManager()
      .addImporter(new REImporter(app), '.re.json', '.json');

    app
      .getHotKeyManager()
      .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => {
        app.getExportManager().tryExportFile('session', app.getSession());
      })
      .registerHotKey('New', [CTRL_KEY, 'KeyN'], () => {
        this.clear(app);
      })
      .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () => {
        app.getUndoManager().undo();
      })
      .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => {
        app.getUndoManager().redo();
      });
  }

  /** @override */
  update(app) {
    this._machineController.update();
  }

  /** @override */
  destroy(app) {}

  /** @override */
  clear(app) {
    if (window.confirm(app.getLocale().getLocaleString('alert.graph.clear'))) {
      this._machineController.setMachineExpression('');
      app.getUndoManager().clear();
      app.getSession().setProjectName(null);
      let toolbar = app.getToolbarComponent();
      if (toolbar) {
        toolbar.closeBar();
      }
    }
  }

  getMachineController() {
    return this._machineController;
  }
  getErrorChecker() {
    return this._errorChecker;
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

export default REModule;
