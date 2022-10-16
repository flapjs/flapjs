import React from 'react';
import Style from './OverviewPanel.module.css';

import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';
import PanelDivider from 'src/components/panels/PanelDivider';
import PanelSwitch from 'src/components/panels/PanelSwitch';

import StateListView from 'src/modules/fsa2/components/panels/overview/states/StateListView';
import AlphabetListView from 'src/modules/fsa2/components/panels/overview/alphabet/AlphabetListView';
import StackAlphabetListView from './stackalphabet/StackAlphabetListView';
import AutoStateLabelView from 'src/modules/fsa2/components/panels/overview/AutoStateLabelView';
import { LocaleString } from 'src/libs/i18n';

class OverviewPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onAutoLayoutApply = this.onAutoLayoutApply.bind(this);
    this.onAutoLayoutChange = this.onAutoLayoutChange.bind(this);
    this.onAutoLabelChange = this.onAutoLabelChange.bind(this);
    this.onSnapToGridChange = this.onSnapToGridChange.bind(this);
  }

  onAutoLayoutApply(e) {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    graphController.applyAutoLayout();
  }

  onAutoLayoutChange(e) {
    //TODO: Not yet implemented...
  }

  onAutoLabelChange(e) {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    graphController.setAutoRenameNodes(e.target.checked);
  }

  onSnapToGridChange(e) {
    //TODO: Not yet implemented...
  }

  /** @override */
  render() {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    const graphView = currentModule.getGraphView();
    const machineController = currentModule.getMachineController();
    const autoRename = graphController.shouldAutoRenameNodes();

    return (
      <PanelContainer
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        unlocalizedTitle={OverviewPanel.UNLOCALIZED}>
        <PanelSection title={'States'} initial={true}>
          <StateListView graphController={graphController} graphView={graphView}/>
        </PanelSection>
        <PanelSection title={'Alphabet'} initial={true}>
          <AlphabetListView machineController={machineController} />
        </PanelSection>
        <PanelSection title={'Stack Alphabet'} initial={true}>
          <StackAlphabetListView machineController={machineController} />
        </PanelSection>

        <PanelDivider />

        <AutoStateLabelView graphController={graphController} />

        <button
          className={Style.autolayout_button}
          onClick={this.onAutoLayoutApply}
          disabled={graphController.getGraph().isEmpty()}>
          <LocaleString entity="action.overview.autolayout"/>
        </button>

        <PanelDivider />

        <PanelSwitch
          id={'overview-auto-label'}
          checked={autoRename}
          title={'Auto rename nodes'}
          onChange={this.onAutoLabelChange}
        />
        <PanelSwitch
          id={'overview-auto-layout'}
          checked={false}
          title={'Auto layout nodes'}
          disabled={true}
          onChange={this.onAutoLayoutChange}
        />
        <PanelSwitch
          id={'overview-snap-grid'}
          checked={false}
          title={'Snap-to-grid'}
          disabled={true}
          onChange={this.onSnapToGridChange}
        />
      </PanelContainer>
    );
  }
}
OverviewPanel.UNLOCALIZED = 'component.overview.title';

export default OverviewPanel;
