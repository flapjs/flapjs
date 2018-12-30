import React from 'react';
import Config from 'config.js';

import Notifications from 'system/notification/Notifications.js';
import NFAToDFAConversionWarningMessage from 'modules/fsa/notifications/NFAToDFAConversionWarningMessage.js';

class AnalysisPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = null;
    this.optimizeUnreachOption = null;
    this.optimizeRedundOption = null;

    this.onConvertToDFA = this.onConvertToDFA.bind(this);
    this.onConvertToNFA = this.onConvertToNFA.bind(this);

    this.onOptimizeMachine = this.onOptimizeMachine.bind(this);
  }

  onDeleteAllUnreachable(e)
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const unreachableArray = machineController.getMachineBuilder().machineErrorChecker.getUnreachableNodes();
    graphController.deleteTargetNodes(unreachableArray);
  }

  onConvertToDFA(e)
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const props = {graphController: graphController, machineController: machineController};
    const messageTag = Config.MACHINE_CONVERSION_MESSAGE_TAG;

    //machineController.convertMachineTo("DFA");
    Notifications.addMessage(I18N.toString("message.warning.convertNFAToDFA"),
      "warning", messageTag, NFAToDFAConversionWarningMessage, props);
  }

  onConvertToNFA(e)
  {
    const machineController = this.props.currentModule.getMachineController();
    machineController.convertMachineTo("NFA");
  }

  onOptimizeMachine(e)
  {
    if (this.optimizeUnreachOption.checked)
    {
      this.onDeleteAllUnreachable(e);
    }
  }

  canOptimize()
  {
    return (this.optimizeRedundOption && this.optimizeRedundOption.checked) ||
    (this.optimizeUnreachOption && this.optimizeUnreachOption.checked);
  }

  render()
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();

    const graph = graphController.getGraph();
    const machineBuilder = machineController.getMachineBuilder();

    return <div className={"panel-container " + this.props.className} id="analysis" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title"><h1>{I18N.toString("component.analysis.title")}</h1></div>
      <div className="panel-content">

        {/*Optimize*/}
        <div style={{paddingBottom: "0.5em"}}>
          <h3 style={{marginBottom: "0"}}>Optimizations</h3>
          <div style={{paddingBottom: "0.5em"}}>
            <div>
              <input ref={ref=>this.optimizeUnreachOption=ref} id="opt-unreach" type="checkbox"/>
              <label htmlFor="opt-unreach">Unreachables</label>
            </div>
            <div>
              <input ref={ref=>this.optimizeRedundOption=ref} id="opt-redund" type="checkbox" disabled={true}/>
              <label htmlFor="opt-redund">Redundant States</label>
            </div>
          </div>
          <button className="panel-button" onClick={this.onOptimizeMachine} disabled={!this.canOptimize()}>Optimize</button>
        </div>

        <hr/>
        {
          machineBuilder.getMachineType() == "DFA" ?
            <button className="panel-button" onClick={this.onConvertToNFA}>
              {I18N.toString("action.overview.convertnfa")}
            </button>
          : machineBuilder.getMachineType() == "NFA" ?
            <button className="panel-button" onClick={this.onConvertToDFA}>
              {I18N.toString("action.overview.convertdfa")}
            </button>
          : null
        }

      </div>
      <div className="panel-bottom"></div>
    </div>;
  }
}
Object.defineProperty(AnalysisPanel, 'TITLE', {
  get: function() { return I18N.toString("component.analysis.title"); }
});
AnalysisPanel.UNLOCALIZED_NAME = "component.analysis.title";

export default AnalysisPanel;
