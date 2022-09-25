import React from 'react';
import Style from './AnalysisPanel.module.css';

import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';

class AnalysisPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onConvertToNFA = this.onConvertToNFA.bind(this);
  }

  onConvertToNFA(e) {
    this.props.session
      .getApp()
      .getExportManager()
      .tryExportFile('re2fsa', this.props.session);
  }

  /** @override */
  render() {
    // const session = this.props.session;

    return (
      <PanelContainer
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={AnalysisPanel.TITLE}>
        <PanelSection title={'Optimizations'} initial={true}>
          <button
            className={Style.analysis_button}
            onClick={this.onConvertToNFA}>
            {I18N.toString('action.overview.convertnfa')}
          </button>
        </PanelSection>
        <PanelSection title={'Related Machines'}></PanelSection>
      </PanelContainer>
    );
  }
}
Object.defineProperty(AnalysisPanel, 'TITLE', {
  get: function () {
    return I18N.toString('component.analysis.title');
  },
});

export default AnalysisPanel;
