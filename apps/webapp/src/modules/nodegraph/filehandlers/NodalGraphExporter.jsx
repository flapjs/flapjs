import SessionExporter from 'src/session/SessionExporter';

import JSONFileIcon from 'src/assets/icons/file-json.svg';

class NodalGraphExporter extends SessionExporter {
  constructor(jsonGraphParser) {
    super('.node.json');
    this._graphParser = jsonGraphParser;
  }

  /** @override */
  onExportSession(session, dst) {
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    const graph = graphController.getGraph();
    const graphData = this._graphParser.objectify(graph);

    dst['graphData'] = graphData;
  }

  /** @override */
  getIconClass() {
    return JSONFileIcon;
  }
  /** @override */
  getUnlocalizedLabel() {
    return 'file.export.machine';
  }
}

export default NodalGraphExporter;
