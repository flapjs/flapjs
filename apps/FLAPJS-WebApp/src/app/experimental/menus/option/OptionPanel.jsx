import React from 'react';
import Style from './OptionPanel.module.css';

import LocalStorage from 'src/app/util/storage/LocalStorage';
import StyleInput from 'src/app/util/theme/components/StyleInput';

import PanelContainer from 'src/app/experimental/panels/PanelContainer';
import PanelSection from 'src/app/experimental/panels/PanelSection';
import PanelSwitch from 'src/app/experimental/panels/PanelSwitch';
import PanelButton from 'src/app/experimental/panels/PanelButton';

import PreviewView from './PreviewView';
import { VERSION } from 'src/globals';

const HIDDEN_STYLE_GROUP_NAME = 'hidden';

//This should be the same as the one referred to by index.js
const DISABLE_EXIT_WARNING_STORAGE_ID = 'disableExitWarning';

class OptionPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            theme: 'default',
            customTheme: false,
            exitWarning: LocalStorage.getData(DISABLE_EXIT_WARNING_STORAGE_ID) === 'true'
        };

        this.onChangeTheme = this.onChangeTheme.bind(this);
    }

    onChangeTheme(e)
    {
        const session = this.props.session;
        const app = session.getApp();

        const themeManager = app.getThemeManager();
        const prevTheme = this.state.theme;
        const theme = e.target.value;
        if (prevTheme === theme) return;

        themeManager.loadTheme(theme);

        this.setState({ theme: theme });
    }

    renderStyleGroups()
    {
        const themeManager = this.props.session.getApp().getThemeManager();
        const result = [];
        for (const groupName of themeManager.getStyleGroupNames())
        {
            if (groupName === HIDDEN_STYLE_GROUP_NAME) continue;
            const styles = themeManager.getStylesByGroup(groupName);
            result.push(
                <PanelSection
                    key={groupName}
                    title={I18N.toString('options.colorgroup.' + groupName)}
                    full={true}>
                    {styles.map(e =>
                        <StyleInput key={e.getName()} className={Style.input_option} value={e}
                            title={I18N.toString('options.' + e.getName())} />)}
                </PanelSection>
            );
        }
        return result;
    }

    /** @override */
    render()
    {
        const session = this.props.session;
        const themeManager = session.getApp().getThemeManager();

        return (
            <PanelContainer id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={I18N.toString('component.options.title')}>
                <PanelSection title="Theme">
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '60%' }}>
                            <div id="options-theme-select-container">
                                <select id="options-theme-select" className="panel-select"
                                    value={this.state.theme}
                                    onChange={this.onChangeTheme}
                                    disabled={this.state.customTheme}>
                                    <option value="default">Default</option>
                                    <option value="ucsd">UC San Diego</option>
                                    <option value="duke">Duke University</option>
                                    <option value="mit">MIT</option>
                                </select>
                                {
                                    !this.state.customTheme &&
                                    <PanelButton onClick={() => this.setState({ customTheme: true })}>
                                        {I18N.toString('action.options.changetheme')}
                                    </PanelButton>
                                }
                            </div>
                            {
                                this.state.customTheme &&
                                <div>
                                    {this.renderStyleGroups()}

                                    <PanelButton onClick={(e) => 
                                    {
                                        themeManager.reset();
                                        this.setState({ customTheme: false });
                                    }}>
                                        {I18N.toString('action.options.reset')}
                                    </PanelButton>
                                </div>
                            }
                        </div>
                        <div>
                            <PreviewView />
                        </div>
                    </div>
                </PanelSection>

                <PanelSwitch id={'option-exitwarning'}
                    checked={this.state.exitWarning}
                    title={I18N.toString('options.exitwarning')}
                    onChange={(e) => 
                    {
                        const result = e.target.checked;
                        this.setState({ exitWarning: result });
                        LocalStorage.setData(DISABLE_EXIT_WARNING_STORAGE_ID, '' + result);
                    }} />
                <label className={Style.version}>
                    {`v${VERSION}`}
                </label>
            </PanelContainer>
        );
    }
}

export default OptionPanel;