import React from 'react';

import PanelContainer from 'src/components/panels/PanelContainer';
import { LocaleConsumer, LocaleString } from 'src/libs/i18n';
import PanelList from 'src/components/panels/PanelList';
import PanelButton from 'src/components/panels/PanelButton';

export default function LanguagePanel(props) {
  return (
    <LocaleConsumer>
      {locale => (
        <PanelContainer
          id={props.id}
          className={props.className}
          style={props.style}
          unlocalizedTitle="component.language.title">
          <PanelList>
            <LanguageButton locale={locale} langCode="en_us" title="English"/>
            <LanguageButton locale={locale} langCode="xx_pirate" title="Pirate Speak"/>
          </PanelList>
        </PanelContainer>
      )}
    </LocaleConsumer>
  );
}

function LanguageButton(props) {
  const { locale, langCode, title } = props;
  return (
    <PanelButton onClick={(e) => locale.setLanguage(langCode)}>
      <LocaleString entity={title}/>
    </PanelButton>
  )
}
