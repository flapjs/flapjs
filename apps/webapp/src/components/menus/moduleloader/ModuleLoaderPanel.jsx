import React from 'react';
import Style from './ModuleLoaderPanel.module.css';

import PanelContainer from 'src/components/panels/PanelContainer';
import IconButton from 'src/components/IconButton';

import Modules from 'src/modules/Modules';

class ModuleLoaderPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  renderModuleButton(moduleKey, moduleInfo) {
    const session = this.props.session;
    return (
      <IconButton
        key={moduleKey}
        className={Style.module_button}
        title={moduleInfo.name + ' (' + moduleInfo.version + ')'}
        disabled={moduleInfo['disabled']}
        onClick={(e) => {
          session.restartSession(session.getApp(), moduleKey);
        }}></IconButton>
    );
  }

  /** @override */
  render() {
    return (
      <PanelContainer
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        unlocalizedTitle="Change Modules">
        <div className={Style.module_button_list}>
          {Object.keys(Modules).map((e) =>
            this.renderModuleButton(e, Modules[e])
          )}
        </div>
      </PanelContainer>
    );
  }
}

export default ModuleLoaderPanel;
