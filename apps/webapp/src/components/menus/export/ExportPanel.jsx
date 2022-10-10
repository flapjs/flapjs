import React from 'react';
import Style from '../MenuPanel.module.css';

import SessionExporter from 'src/session/SessionExporter';
import IconButton from 'src/components/IconButton';
import { LocaleConsumer, LocaleString } from 'src/libs/i18n';

class ExportPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  renderExporterButton(exportType) {
    const exporter = this.props.session
      .getApp()
      .getExportManager()
      .getExporterByExportType(exportType);
    if (!(exporter instanceof SessionExporter)) return <span></span>;

    const IconClass = exporter.getIconClass();

    return (
      <LocaleConsumer>
        {locale => (
          <IconButton
            key={exporter.getUnlocalizedLabel() + ':' + exportType}
            className={Style.panel_button}
            title={locale.getLocaleString(exporter.getUnlocalizedLabel())}
            onClick={() =>
              this.props.session
                .getApp()
                .getExportManager()
                .tryExportFile(exportType, this.props.session)
            }>
            {IconClass && <IconClass />}
          </IconButton>
        )}
      </LocaleConsumer>
    );
  }

  /** @override */
  render() {
    const session = this.props.session;
    const exportManager = session.getApp().getExportManager();
    const exportTypes = exportManager.getExportTypes();

    return (
      <div
        id={this.props.id}
        className={Style.panel_container + ' ' + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1><LocaleString entity="component.exporting.title"/></h1>
        </div>
        <div className={Style.panel_content}>
          {exportTypes.map((e) => this.renderExporterButton(e))}
        </div>
      </div>
    );
  }
}

export default ExportPanel;
