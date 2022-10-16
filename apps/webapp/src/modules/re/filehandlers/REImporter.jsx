import SessionImporter from 'src/session/SessionImporter';

class REImporter extends SessionImporter {
  constructor(app) {
    super(app);

    this._prevExpression = '';
  }

  /** @override */
  onParseSession(session, fileData) {
    return JSON.parse(fileData);
  }

  /** @override */
  onPreImportSession(session) {
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();
    this._prevExpression = machineController.getMachineExpression();
  }

  /** @override */
  onImportSession(session, sessionData) {
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();

    const machineExpression = sessionData['machineData']['expression'];
    if (machineExpression)
      machineController.setMachineExpression(machineExpression);
  }

  /** @override */
  onPostImportSession(session) {
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();

    // Compares the graph hash before and after import, captures event if they are not equal
    const nextExpression = machineController.getMachineExpression();
  }
}

export default REImporter;
