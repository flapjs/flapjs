import AbstractEventHandler from 'src/session/manager/undo/AbstractEventHandler';

class SafeExpressionEventHandler extends AbstractEventHandler {
  constructor(machineController) {
    super();

    this._machineController = machineController;
    this._expression = machineController.getMachineExpression();
  }

  /** @override */
  applyUndo(undoManager) {
    const prevEvent = undoManager.getPreviousEvent();
    if (prevEvent instanceof SafeExpressionEventHandler) {
      prevEvent.applyRedo(undoManager);
    } else {
      this._machineController.clear();
    }
  }

  /** @override */
  applyRedo(undoManager) {
    this._machineController.setMachineExpression(this._expression);
  }
}
export default SafeExpressionEventHandler;
