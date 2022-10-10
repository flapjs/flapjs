import SessionExporter from 'src/session/SessionExporter';

import JSONFileIcon from 'src/assets/icons/file-json.svg';

class REExporter extends SessionExporter {
  constructor() {
    super('.re.json');
  }

  /** @override */
  onExportSession(session, dst) {
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();

    dst['machineData'] = {
      expression: machineController.getMachineExpression(),
    };
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

export default REExporter;
