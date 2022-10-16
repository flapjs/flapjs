import SessionImporter from 'src/session/SessionImporter';

class FSAJFFImporter extends SessionImporter {
  constructor(app, jffGraphParser) {
    super();

    this._app = app;
    this._graphParser = jffGraphParser;
  }

  /** @override */
  onParseSession(session, fileData) {
    return new DOMParser().parseFromString(fileData, 'text/xml');
  }

  /** @override */
  onPreImportSession(session) {
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    const graph = graphController.getGraph();
    this._prevGraphHash = graph.getHashCode(true);
  }

  /** @override */
  onImportSession(session, sessionData) {
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    const graph = graphController.getGraph();

    this._graphParser.parse(sessionData, graph);
  }

  /** @override */
  onPostImportSession(session) {}
}

export default FSAJFFImporter;
