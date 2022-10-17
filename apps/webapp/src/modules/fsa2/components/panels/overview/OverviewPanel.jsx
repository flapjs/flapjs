import React from 'react';
import Style from './OverviewPanel.module.css';

import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';
import PanelDivider from 'src/components/panels/PanelDivider';
import PanelSwitch from 'src/components/panels/PanelSwitch';

import StateListView from './states/StateListView';
import AlphabetListView from './alphabet/AlphabetListView';
import TransitionChartView from './transitions/TransitionChartView';
import TransitionTableView from './transitions/TransitionTableView';
import AutoStateLabelView from './AutoStateLabelView';
import { LocaleConsumer, LocaleString } from 'src/libs/i18n';

const MACHINE_TYPE_DFA = 'DFA';
const MACHINE_TYPE_NFA = 'NFA';

class OverviewPanel extends React.Component {
  constructor(props) {
    super(props);

    this.onMachineTypeChange = this.onMachineTypeChange.bind(this);
    this.onAutoLayoutApply = this.onAutoLayoutApply.bind(this);
    this.onAutoLayoutChange = this.onAutoLayoutChange.bind(this);
    this.onAutoLabelChange = this.onAutoLabelChange.bind(this);
    this.onSnapToGridChange = this.onSnapToGridChange.bind(this);
  }

  onMachineTypeChange(e) {
    const newValue = e.target.value;

    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();
    const machine = machineController.getMachineBuilder().getMachine();

    switch (newValue) {
      case MACHINE_TYPE_DFA:
        machine.setDeterministic(true);
        break;
      case MACHINE_TYPE_NFA:
        machine.setDeterministic(false);
        break;
      default:
        throw new Error("Unknown machine type '" + newValue + "'");
    }
  }

  onAutoLayoutApply(e) {
    const currentModule = this.props.session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    graphController.applyAutoLayout();
  }

  onAutoLayoutChange(e) {
    //TODO: Not yet implemented...
  }

  onAutoLabelChange(e) {
    const currentModule = this.props.session.getCurrentModule();
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
    if (!currentModule) return;
    
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const graphView = currentModule.getGraphView();
    const machineType = machineController
      .getMachineBuilder()
      .getMachine()
      .isDeterministic()
      ? MACHINE_TYPE_DFA
      : MACHINE_TYPE_NFA;
    const autoRename = graphController.shouldAutoRenameNodes();

    return (
      <LocaleConsumer>
        {locale => (
          <PanelContainer
            id={this.props.id}
            className={this.props.className}
            style={this.props.style}
            unlocalizedTitle={OverviewPanel.UNLOCALIZED}>
            <select
              className={Style.machine_type_select}
              value={machineType}
              onChange={this.onMachineTypeChange}>
              <option>{MACHINE_TYPE_DFA}</option>
              <option>{MACHINE_TYPE_NFA}</option>
            </select>

            <PanelDivider />

            <PanelSection title={'States'} initial={true}>
              <StateListView
                graphController={graphController}
                graphView={graphView}
              />
            </PanelSection>
            <PanelSection title={'Alphabet'} initial={true}>
              <AlphabetListView machineController={machineController} />
            </PanelSection>

            <PanelDivider />

            <PanelSection
              title={'Transition Chart'}
              disabled={graphController.getGraph().getEdgeCount() <= 0}>
              <TransitionChartView machineController={machineController} />
            </PanelSection>
            <PanelSection
              title={'Transition Table'}
              disabled={graphController.getGraph().getNodeCount() <= 0}>
              <TransitionTableView machineController={machineController} />
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
        )}
      </LocaleConsumer>
    );
  }
}
OverviewPanel.UNLOCALIZED = 'component.overview.title';

export default OverviewPanel;
