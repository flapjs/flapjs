import React from 'react';
// import Style from './OverviewPanel.module.css';

import PanelContainer from 'src/components/panels/PanelContainer';
import PanelSection from 'src/components/panels/PanelSection';

import AlphabetListView from './alphabet/AlphabetListView';

import {
  EMPTY,
  CONCAT,
  UNION,
  KLEENE,
  SIGMA,
  EMPTY_SET,
  PLUS,
} from 'src/modules/re/machine/RE';

class OverviewPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  /** @override */
  render() {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();

    const machineController = currentModule.getMachineController();

    return (
      <PanelContainer
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        unlocalizedTitle={OverviewPanel.UNLOCALIZED}>
        <PanelSection title={'Terminals'} initial={true}>
          <AlphabetListView machineController={machineController} />
        </PanelSection>
        <PanelSection title={'Symbol Key'} initial={true}>
          <table>
            <tbody>
              <tr>
                <td>Epsilon</td>
                <td>{EMPTY}</td>
              </tr>
              <tr>
                <td>Union</td>
                <td>{UNION}</td>
              </tr>
              <tr>
                <td>Concat</td>
                <td>{CONCAT}</td>
              </tr>
              <tr>
                <td>Kleene Star</td>
                <td>{KLEENE}</td>
              </tr>
              <tr>
                <td>Kleene Plus</td>
                <td>{PLUS}</td>
              </tr>
              <tr>
                <td>Sigma</td>
                <td>{SIGMA}</td>
              </tr>
              <tr>
                <td>Empty Set</td>
                <td>{EMPTY_SET}</td>
              </tr>
            </tbody>
          </table>
        </PanelSection>
      </PanelContainer>
    );
  }
}
OverviewPanel.UNLOCALIZED = 'component.overview.title';

export default OverviewPanel;
