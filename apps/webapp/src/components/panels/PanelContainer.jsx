import React from 'react';
import { LocaleString } from 'src/libs/i18n';
import Style from './PanelContainer.module.css';

class PanelContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  /** @override */
  render() {
    const unlocalizedTitle = this.props.unlocalizedTitle;

    return (
      <div
        id={this.props.id}
        className={Style.panel_container + ' ' + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1><LocaleString entity={unlocalizedTitle}/></h1>
        </div>
        <div className={Style.panel_content}>{this.props.children}</div>
        <div className={Style.panel_bottom}></div>
      </div>
    );
  }
}

export default PanelContainer;
