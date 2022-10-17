import React from 'react';

import SessionExporter from 'src/session/SessionExporter';
import { LocaleString } from 'src/libs/i18n';
import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';
import PanelButton from 'src/components/panels/PanelButton';
import PanelList from 'src/components/panels/PanelList';

export default function ExportPanel(props) {
  const session = props.session;
  const app = session.getApp();
  if (!app) return;

  const exportManager = app.getExportManager();
  const exportTypes = exportManager.getExportTypes();
  return (
    <PanelContainer
      id={props.id}
      className={props.className}
      style={props.style}
      unlocalizedTitle="component.exporting.title">
      <PanelSection>
        <PanelList>
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
                  onClick={() =>
                    session
                      .getApp()
                      .getExportManager()
                      .tryExportFile(e, session)
                  }/>
              );
            })}
        </PanelList>
      </PanelSection>
    </PanelContainer>
  );
}

export function ExporterButton(props) {
  const { exporter, onClick } = props;
  const IconClass = exporter.getIconClass();
  return (
    <PanelButton style={{ flex: 1 }} onClick={onClick}>
      {IconClass && <IconClass />}
      <LocaleString entity={exporter.getUnlocalizedLabel()}/>
    </PanelButton>
  );
}
