import React from 'react';

import { userClearGraph } from 'src/components/UserUtil';
import { CTRL_KEY } from 'src/session/manager/hotkey/HotKeyManager';

import NodeGraph from 'src/graph2/NodeGraph';
import GraphNode from 'src/graph2/element/GraphNode';
import QuadraticEdge from 'src/graph2/element/QuadraticEdge';

import NodeGraphParser from 'src/graph2/NodeGraphParser';
import NodeGraphController from './graph/NodeGraphController';

import { registerImageExporters } from './filehandlers/NodalGraphImageExporter';

import SafeUndoNodeGraphEventHandler from 'src/graph2/SafeUndoNodeGraphEventHandler';

/* COMPONENTS */

import PanelContainer from 'src/components/panels/PanelContainer';

import { Playground } from './Playground';
import InputController from 'src/graph2/controller/InputController';

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
      .getUndoManager()
      .setEventHandlerFactory(
        (...args) =>
          new SafeUndoNodeGraphEventHandler(
            this._graphController,
            this._graphParser
          )
      );

    app.getDrawerManager().addPanelClass((props) => (
      <PanelContainer
        id={props.id}
        className={props.className}
        style={props.style}
        unlocalizedTitle={'Your Average Graph Editor'}>
        <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
        <p>{'<- Tap on a tab to begin!'}</p>
      </PanelContainer>
    ));

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
