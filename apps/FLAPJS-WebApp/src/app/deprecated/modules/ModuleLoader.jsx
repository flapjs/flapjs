import React from 'react';
import Router from 'router';

import App from 'src/app/deprecated/content/App';
import Modules from 'src/app/modules/Modules';
import LocalSave from 'src/app/deprecated/system/localsave/LocalSave';
import ExperimentalApp from 'src/app/experimental/App';

export const CURRENT_MODULE_STORAGE_ID = "currentModule";
const MODULE_LOAD_DELAY = 300;
let MODULE_LOADING = false;
let MODULE_TIMEOUT = null;
let IS_DEFAULT_MODULE = true;

class ModuleLoader extends React.Component
{
  constructor(props)
  {
    super(props);

    this._timeout = null;
  }

  static loadModuleFromStorage()
  {
    const savedModuleID = LocalSave.getStringFromStorage(CURRENT_MODULE_STORAGE_ID);
    return ModuleLoader.loadModule(savedModuleID);
  }

  static loadModule(moduleID)
  {
    if (!moduleID) return false;

    const moduleInfo = Modules[moduleID];
    if (!moduleInfo)
    {
      window.alert("Cannot find module with id \'" + moduleID + "\'");
      return false;
    }

    const useExperimental = moduleInfo['experimental'];

    //Overwrite any past calls...
    if (MODULE_TIMEOUT) clearTimeout(MODULE_TIMEOUT);

    MODULE_TIMEOUT = setTimeout(() => {
      moduleInfo.fetch((moduleClass) => {
        LocalSave.setStringToStorage(CURRENT_MODULE_STORAGE_ID, moduleID);

        MODULE_TIMEOUT = null;
        IS_DEFAULT_MODULE = false;
        if (useExperimental)
        {
          Router.routeTo(ModuleLoader, {
            moduleClass,
            appClass: ExperimentalApp,
          });
        }
        else
        {
          Router.routeTo(ModuleLoader, {moduleClass: moduleClass});
        }
      });
    }, MODULE_LOAD_DELAY);

    return true;
  }

  static isDefaultModule()
  {
    return IS_DEFAULT_MODULE;
  }

  static isModuleLoading()
  {
    return MODULE_TIMEOUT !== null;
  }

  /** @override */
  componentDidMount()
  {
    MODULE_TIMEOUT = setTimeout(() => {
      MODULE_TIMEOUT = null;
      const AppClass = this.props.appClass || App;
      Router.routeTo(AppClass, {moduleClass: this.props.moduleClass});
    }, MODULE_LOAD_DELAY);
  }

  /** @override */
  render()
  {
    return (<div></div>);
  }
}

export default ModuleLoader;
