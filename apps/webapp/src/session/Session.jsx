import Modules from 'src/modules/Modules';
import LocalStorage from 'src/util/storage/LocalStorage';
import * as URLHelper from 'src/util/URLHelper';
import { guid } from 'src/util/MathHelper';

import AppModule from 'src/modules/app/AppModule';

import { SlotProvider } from 'src/libs/slot';
import { Logger } from 'src/libs/logger';

const LOGGER = new Logger('Session');

const DEFAULT_MODULE_ID = 'fsa';
export const CURRENT_MODULE_STORAGE_ID = 'currentModule';
const MODULE_LOAD_DELAY = 300;
let MODULE_TIMEOUT = null;

/**
 * @param {object} app 
 * @param {Array<?>} modules
 */
function getSlottedForModules(app, modules) {
  let slotted = [];
  for(let module of modules) {
    let moduleClass = module.constructor;
    let superProps = {
      app,
      module,
    };
    let i = 1;
    if ('renderers' in moduleClass) {
      for(let { render, props = {}, on } of moduleClass.renderers) {
        let key = `${moduleClass.moduleId}${i++}`;
        slotted.push(SlotProvider.createSlotted('app', on, render, {
          ...props,
          ...superProps,
        }, key));
      }
    }
  }
  return slotted;
}

class Session {
  constructor() {
    this._name = 'Untitled';
    this._module = null;
    this._moduleClass = null;
    this._moduleStarted = false;
    /** @type {import('../components/App').default} */
    this._app = null;

    this._sessionID = null;

    this._listeners = [];
  }

  addListener(listener) {
    this._listeners.push(listener);
    return this;
  }

  startSession(app, moduleName = null) {
    if (this._module !== null) return;

    // Load from storage, url, or default, if not specified...
    if (!moduleName || moduleName.length <= 0) {
      const urlParams = URLHelper.getURLParameters(URLHelper.getCurrentURL());
      if ('module' in urlParams) moduleName = urlParams['module'];
      if (!moduleName || moduleName.length <= 0) {
        moduleName = LocalStorage.getData(CURRENT_MODULE_STORAGE_ID);
        if (!moduleName || moduleName.length <= 0) {
          moduleName = DEFAULT_MODULE_ID;
        }
      }
    }

    LOGGER.info(`Starting session for module '${moduleName}'...`);

    // Check registered module info...
    let moduleInfo = Modules[moduleName];
    if (!moduleInfo) {
      moduleName = DEFAULT_MODULE_ID;
      moduleInfo = Modules[moduleName];

      if (!moduleInfo) {
        window.alert(
          "Cannot find registered module with id '" + moduleName + "'"
        );
        return;
      }
    }

    // Overwrite any past calls...
    if (MODULE_TIMEOUT) clearTimeout(MODULE_TIMEOUT);

    MODULE_TIMEOUT = setTimeout(() => {
      moduleInfo.fetch((ModuleClass) => {
        MODULE_TIMEOUT = null;

        this._app = app;
        this._moduleClass = ModuleClass;
        this._sessionID = '#' + guid();
        try {
          let appModuleInstance = new AppModule();
          let moduleInstance = new ModuleClass(app);
          this._module = moduleInstance;
          
          let slotted = getSlottedForModules(app, [
            moduleInstance,
            appModuleInstance,
          ]);
          SlotProvider.refresh('app', slotted);

          // Allows renderers to be created...
          app.forceUpdate();

          this._module.initialize(app);

          for (const listener of this._listeners) {
            listener.onSessionStart(this);
          }

          LocalStorage.setData(CURRENT_MODULE_STORAGE_ID, moduleName);

          this._moduleStarted = true;
        } catch (e) {
          window.alert(
            "Could not load module with id '" + moduleName + "':\n" + e.message
          );
        }
      });
    }, MODULE_LOAD_DELAY);
  }

  restartSession(app, moduleName = null) {
    if (this._module === null)
      throw new Error('Cannot restart session that is not yet started');

    this.stopSession(app);
    this.startSession(app, moduleName);
  }

  updateSession(app) {
    if (this._module && this._moduleStarted) {
      this._module.update(app);
    }
  }

  stopSession(app) {
    if (this._module === null) return;

    LOGGER.info('Stopping session...');

    for (const listener of this._listeners) {
      listener.onSessionStop(this);
    }

    this._module.destroy(this._app);
    SlotProvider.clearAll('app');
    this._moduleStarted = false;
    this._moduleClass = null;
    this._module = null;
    this._sessionID = null;
    this._app = null;
  }

  setProjectName(name) {
    if (!name || name.length <= 0) {
      this._name = this._app.getLocale().getLocaleString('file.untitled');
    } else {
      this._name = name;
    }

    const value = this._name;
    const element = document.getElementById('window-title');
    const string = element.innerHTML;
    const separator = string.indexOf('-');
    if (separator !== -1) {
      element.innerHTML = string.substring(0, separator).trim() + ' - ' + value;
    } else {
      element.innerHTML = string + ' - ' + value;
    }
  }

  getProjectName() {
    return this._name;
  }
  getCurrentModule() {
    return this._module;
  }
  isModuleLoaded() {
    return this._module !== null;
  }
  getSessionID() {
    return this._sessionID;
  }
  getApp() {
    return this._app;
  }
}

export default Session;
