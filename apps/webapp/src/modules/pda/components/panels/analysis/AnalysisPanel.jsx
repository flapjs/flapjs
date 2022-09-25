import React from 'react';
import Style from './AnalysisPanel.module.css';

import { getUnreachableNodes } from 'src/graph2/util/NodeGraphUtils';

import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';
import PanelCheckbox from 'src/components/panels/PanelCheckbox';

class AnalysisPanel extends React.Component {
  constructor(props) {
    super(props);

    this.optimizeUnreachOption = null;
    this.optimizeRedundOption = null;

    this.onOptimizeMachine = this.onOptimizeMachine.bind(this);
  }

  onDeleteAllUnreachable(e) {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    const unreachableArray = getUnreachableNodes(graphController.getGraph());
    graphController.deleteTargetNodes(unreachableArray);
  }

  onOptimizeMachine(e) {
    if (this.optimizeUnreachOption.isChecked()) {
      this.onDeleteAllUnreachable(e);
    }
  }

  canOptimize() {
    return (
      (this.optimizeRedundOption && this.optimizeRedundOption.isChecked()) ||
      (this.optimizeUnreachOption && this.optimizeUnreachOption.isChecked())
    );
  }

  /** @override */
  render() {
    //const session = this.props.session;

    return (
      <PanelContainer
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={AnalysisPanel.TITLE}>
        <PanelSection title={'Optimizations'} initial={true}>
          <PanelCheckbox
            ref={(ref) => (this.optimizeUnreachOption = ref)}
            id="opt-unreach"
            title="Unreachables"
            value="unreach"
          />
          <PanelCheckbox
            ref={(ref) => (this.optimizeRedundOption = ref)}
            disabled={true}
            id="opt-redund"
            title="Redundant States"
            value="redund"
          />
          <button
            className={Style.analysis_button}
            onClick={this.onOptimizeMachine}
            disabled={!this.canOptimize()}>
            Optimize
          </button>
        </PanelSection>
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
