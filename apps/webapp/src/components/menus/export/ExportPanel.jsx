import React from 'react';
import Style from '../MenuPanel.module.css';

import SessionExporter from 'src/session/SessionExporter';
import IconButton from 'src/components/IconButton';
import { useLocale } from 'src/libs/i18n';
import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';

export default class ExportPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  /** @override */
  render() {
    const props = this.props;
    const session = this.props.session;
    const app = session.getApp();
    const exportManager = app.getExportManager();
    const exportTypes = exportManager.getExportTypes();
    return (
      <PanelContainer
        id={props.id}
        className={props.className}
        style={props.style}
        unlocalizedTitle="component.exporting.title">
        <PanelSection>
          {exportTypes.map((e) => {
              const exporter = session
                .getApp()
                .getExportManager()
                .getExporterByExportType(e);
              let key = exporter.getUnlocalizedLabel() + ':' + e;
              if (!(exporter instanceof SessionExporter)) {
                return <span key={key}></span>
              }
              return (
                <ExporterButton
                  key={key}
                  exporter={exporter}
                  session={session}
                  onClick={() =>
                    session
                      .getApp()
                      .getExportManager()
                      .tryExportFile(e, session)
                  }/>
              );
            })}
        </PanelSection>
      </PanelContainer>
    );
  }
}

export function ExporterButton(props) {
  const { exporter, session, onClick } = props;
  const IconClass = exporter.getIconClass();
  const locale = useLocale();

  return (
    <IconButton
      className={Style.panel_button}
      title={locale.getLocaleString(exporter.getUnlocalizedLabel())}
      onClick={onClick}>
      {IconClass && <IconClass />}
    </IconButton>
  );
}
