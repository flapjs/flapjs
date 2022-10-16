import React from 'react';

import { userClearGraph } from 'src/components/UserUtil';
import { CTRL_KEY } from 'src/session/manager/hotkey/HotKeyManager';

import NodeGraph from 'src/graph2/NodeGraph';
import GraphNode from 'src/graph2/element/GraphNode';
import QuadraticEdge from 'src/graph2/element/QuadraticEdge';

import NodeGraphParser from 'src/graph2/NodeGraphParser';
import NodeGraphController from './graph/NodeGraphController';

import { registerImageExporters } from './filehandlers/NodalGraphImageExporter';

/* COMPONENTS */

import { Playground } from './Playground';
import InputController from 'src/graph2/controller/InputController';
import { AppBar } from '../fsa2/AppBar';
import { MenuBar } from '../fsa2/MenuBar';
import { AboutPanel, DrawerTab } from 'src/components/drawer/DrawerView';
import ExportPanel from 'src/components/menus/export/ExportPanel';
import OptionPanel from 'src/components/menus/option/OptionPanel';
import LanguagePanel from 'src/components/menus/language/LanguagePanel';
import ModuleLoaderPanel from 'src/components/menus/moduleloader/ModuleLoaderPanel';
import { AboutMenu } from 'src/components/appbar/toolbar/ToolbarView';
import { useSerDes } from './NodeGraphSerializer';

const MODULE_NAME = 'nodegraph';
const MODULE_VERSION = '0.0.1';
const MODULE_LOCALIZED_NAME = 'Node Graph';

class NodalGraphModule {

  static get moduleId() {
    return 'nodegraph';
  }

  static get moduleVersion() {
    return '0.0.1';
  }

  static get renderers() {
    return [
      { render: Playground, on: 'playground' },
      { render: AppBar, props: { useSerDes }, on: 'appbar' },
      { render: MenuBar, on: 'menubar' },
      // NOTE: Order matters! Each tab will match the drawer by index.
      { render: AboutPanel, props: { unlocalized: 'Your Average Graph Editor' }, on: 'drawer' },
      { render: DrawerTab, props: { hidden: true }, on: 'drawer.tab' },
      { render: AboutMenu, on: 'menu' },
      { render: ModuleLoaderPanel, on: 'menu' },
      { render: LanguagePanel, on: 'menu' },
      { render: OptionPanel, on: 'menu' },
      { render: ExportPanel, on: 'menu' },
    ];
  }

  constructor(app) {
    this._app = app;

    this._graph = new NodeGraph(GraphNode, QuadraticEdge);
    this._graphParser = new NodeGraphParser();
    this._graphController = new NodeGraphController(app, this._graph);
    this._graphViewComponent = React.createRef();

    this._inputController = new InputController();
  }

  /** @override */
  initialize(app) {
    registerImageExporters(app.getExportManager());

    app
      .getHotKeyManager()
      .registerHotKey('Export to PNG', [CTRL_KEY, 'KeyP'], () => {
        app.getExportManager().tryExportFile('image-png', app.getSession());
      });

    this._graphController.initialize();
  }

  /** @override */
  update(app) {
    this._graphController.update();
  }

  /** @override */
  destroy(app) {
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

  getGraphController() {
    return this._graphController;
  }
  getGraphView() {
    return this._graphViewComponent.current;
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

  getApp() {
    return this._app;
  }
}

export default NodalGraphModule;
