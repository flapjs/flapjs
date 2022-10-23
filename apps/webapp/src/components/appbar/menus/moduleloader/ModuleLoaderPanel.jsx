import React from 'react';

import PanelContainer from 'src/components/panels/PanelContainer';

import Modules from 'src/modules/Modules';
import PanelButton from 'src/components/panels/PanelButton';
import { LocaleString } from 'src/libs/i18n';
import PanelList from 'src/components/panels/PanelList';
import { useSlotContext } from 'src/libs/slot';

export default function ModuleLoaderPanel(props) {
  return (
    <PanelContainer unlocalizedTitle="Change Modules">
      <PanelList>
        {Object.keys(Modules)
          .map((e) => (
            <ModuleButton
              key={e}
              session={props.session}
              moduleInfo={Modules[e]}
              moduleKey={e}/>
          ))}
      </PanelList>
    </PanelContainer>
  );
}

function ModuleButton(props) {
  const { session, moduleInfo, moduleKey } = props;
  const slotContext = useSlotContext();
  return (
    <PanelButton
      disabled={moduleInfo['disabled']}
      onClick={(e) => {
        session.restartSession(session.getApp(), moduleKey, slotContext);
      }}>
      <LocaleString entity={moduleInfo.name + ' (' + moduleInfo.version + ')'}/>
    </PanelButton>
  )
}
