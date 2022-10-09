import React from 'react';
import Style from './LanguagePanel.module.css';

import PanelContainer from 'src/components/panels/PanelContainer';
import IconButton from 'src/components/IconButton';
import { LocaleConsumer } from 'src/libs/i18n';

class LanguagePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  renderLanguageButton(locale, localizedName, langCode) {
    return (
      <IconButton
        key={langCode}
        className={Style.language_button}
        title={localizedName}
        onClick={(e) => locale.setLanguage(langCode)}></IconButton>
    );
  }

  /** @override */
  render() {
    return (
      <LocaleConsumer>
        {locale => (
          <PanelContainer
            id={this.props.id}
            className={this.props.className}
            style={this.props.style}
            title={locale.getLocaleString('component.language.title')}>
            <div className={Style.language_button_list}>
              {this.renderLanguageButton(locale, 'English', 'en_us')}
              {this.renderLanguageButton(locale, 'Pirate Speak', 'xx_pirate')}
            </div>
          </PanelContainer>
        )}
      </LocaleConsumer>
    );
  }
}

export default LanguagePanel;
