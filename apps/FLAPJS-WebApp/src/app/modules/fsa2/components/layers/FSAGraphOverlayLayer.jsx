import React from 'react';

import ViewportEditLayer from 'src/app/graph2/components/layers/ViewportEditLayer';
import ViewportNavigationLayer from 'src/app/graph2/components/layers/ViewportNavigationLayer';

import LabelEditorWidget from 'src/app/graph2/components/widgets/LabelEditorWidget';

import FSALabelEditorRenderer from '../widgets/FSALabelEditorRenderer';

class FSAGraphOverlayLayer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const graphView = this.props.graphView;
        const graphController = this.props.graphController;
        const labelFormatter = graphController.getLabelFormatter();
        const inputController = graphView.getInputController();

        return (
            <React.Fragment>
                <ViewportEditLayer
                    graphController={graphController}
                    inputController={inputController}
                    viewport={graphView.getViewportComponent()}
                    session={session}/>
                <ViewportNavigationLayer
                    style={{ right: 0 }}
                    viewportAdapter={graphView.getViewportAdapter()} />
                <LabelEditorWidget ref={ref => graphController.setLabelEditor(ref)}
                    labelFormatter={labelFormatter}
                    viewport={graphView.getViewportComponent()}
                    saveOnExit={true}>
                    <FSALabelEditorRenderer
                        graphController={graphController}
                        currentModule={currentModule} />
                </LabelEditorWidget>
            </React.Fragment>
        );
    }
}

export default FSAGraphOverlayLayer;