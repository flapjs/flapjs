import React from 'react';
import Style from './OptionPanel.module.css';

import LocalStorage from 'src/util/storage/LocalStorage';
import StyleInput from 'src/util/theme/components/StyleInput';

import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';
import PanelSwitch from 'src/components/panels/PanelSwitch';
import PanelButton from 'src/components/panels/PanelButton';

import PreviewView from './PreviewView';
import { VERSION } from 'src/globals';
import { LocaleConsumer, LocaleString } from 'src/libs/i18n';

const HIDDEN_STYLE_GROUP_NAME = 'hidden';

//This should be the same as the one referred to by index.js
const DISABLE_EXIT_WARNING_STORAGE_ID = 'disableExitWarning';

class OptionPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: 'default',
      customTheme: false,
      exitWarning:
        LocalStorage.getData(DISABLE_EXIT_WARNING_STORAGE_ID) === 'true',
    };

    this.onChangeTheme = this.onChangeTheme.bind(this);
  }

  onChangeTheme(e) {
    const session = this.props.session;
    const app = session.getApp();

    const themeManager = app.getThemeManager();
    const prevTheme = this.state.theme;
    const theme = e.target.value;
    if (prevTheme === theme) return;

    themeManager.loadTheme(theme);

    this.setState({ theme: theme });
  }

  renderStyleGroups() {
    const themeManager = this.props.session.getApp().getThemeManager();
    const result = [];
    for (const groupName of themeManager.getStyleGroupNames()) {
      if (groupName === HIDDEN_STYLE_GROUP_NAME) continue;
      const styles = themeManager.getStylesByGroup(groupName);
      result.push(
        <LocaleConsumer>
          {locale => (
            <PanelSection
              key={groupName}
              title={locale.getLocaleString('options.colorgroup.' + groupName)}
              full={true}>
              {styles.map((e) => (
                <StyleInput
                  key={e.getName()}
                  className={Style.input_option}
                  value={e}
                  title={locale.getLocaleString('options.' + e.getName())}
                />
              ))}
            </PanelSection>
          )}
        </LocaleConsumer>
      );
    }
    return result;
  }

  /** @override */
  render() {
    const session = this.props.session;
    const app = session.getApp();
    if (!app) return;
    
    const themeManager = app.getThemeManager();

    return (
      <LocaleConsumer>
        {locale => (
          <PanelContainer
            id={this.props.id}
            className={this.props.className}
            style={this.props.style}
            unlocalizedTitle="component.options.title">
            <PanelSection>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '60%' }}>
                  <div id="options-theme-select-container">
                    <select
                      id="options-theme-select"
                      className="panel-select"
                      value={this.state.theme}
                      onChange={this.onChangeTheme}
                      disabled={this.state.customTheme}>
                      <option value="default">Default</option>
                      <option value="ucsd">UC San Diego</option>
                      <option value="duke">Duke University</option>
                      <option value="mit">MIT</option>
                    </select>
                    {!this.state.customTheme && (
                      <PanelButton
                        onClick={() => this.setState({ customTheme: true })}>
                        <LocaleString entity="action.options.changetheme"/>
                      </PanelButton>
                    )}
                  </div>
                  {this.state.customTheme && themeManager && (
                    <div>
                      {this.renderStyleGroups()}
                      <PanelButton
                        onClick={(e) => {
                          themeManager.reset();
                          this.setState({ customTheme: false });
                        }}>
                        <LocaleString entity="action.options.reset"/>
                      </PanelButton>
                    </div>
                  )}
                </div>
                <div>
                  <PreviewView />
                </div>
              </div>
            </PanelSection>

            <PanelSwitch
              id={'option-exitwarning'}
              checked={this.state.exitWarning}
              title={locale.getLocaleString('options.exitwarning')}
              onChange={(e) => {
                const result = e.target.checked;
                this.setState({ exitWarning: result });
                LocalStorage.setData(DISABLE_EXIT_WARNING_STORAGE_ID, '' + result);
              }}
            />
            <label className={Style.version}>{`v${VERSION}`}</label>
          </PanelContainer>
        )}
      </LocaleConsumer>
    );
  }
}

export default OptionPanel;
