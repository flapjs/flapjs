import SessionExporter from 'src/session/SessionExporter';

import XMLFileIcon from 'src/assets/icons/file-xml.svg';

class FSAJFFExporter extends SessionExporter {
  constructor(jffGraphParser) {
    super('.jff');
    this._graphParser = jffGraphParser;
  }

  /** @override */
  onExportSession(session, dst) {
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    const graph = graphController.getGraph();
    dst['graphData'] = this._graphParser.objectify(graph);
  }

  /** @override */
  onStringifySession(session, dst) {
    return new XMLSerializer().serializeToString(dst.graphData);
  }

  /** @override */
  getIconClass() {
    return XMLFileIcon;
  }
  /** @override */
  getLabel() {
    return I18N.toString('file.export.jff');
  }
  /** @override */
  getTitle() {
    return I18N.toString('file.export.jff.hint');
  }
}

export default FSAJFFExporter;
