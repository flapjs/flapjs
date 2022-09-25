class MachineChangeHandler {
  constructor() {
    this._listeners = [];
  }

  addListener(listener) {
    if (typeof listener !== 'function')
      throw new Error('Cannot add uncallable listener');
    this._listeners.push(listener);
  }

  removeListener(listener) {
    const i = this._listeners.indexOf(listener);
    if (i >= 0) {
      this._listeners.splice(i, 1);
      return true;
    }
    return false;
  }

  clearListeners() {
    this._listeners.length = 0;
  }

  getListeners() {
    return this._listeners;
  }

  update(machineBuilder) {
    for (const listener of this._listeners) {
      listener(machineBuilder);
    }
  }
}

export default MachineChangeHandler;
