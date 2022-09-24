import React from 'react';
import Style from './LabelEditorWidget.css';

import GraphElement from 'graph2/element/GraphElement.js';
import GraphNode from 'graph2/element/GraphNode.js';
import GraphEdge from 'graph2/element/GraphEdge.js';

import PatternInput from 'graph2/components/widgets/pattern/PatternInput.js';

class LabelEditorWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();
        this.inputComponent = null;

        this.state = {
            open: false
        };

        this._target = null;
        this._targetCallback = null;

        this.onInputSubmit = this.onInputSubmit.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
    }

    openEditor(graphElement, defaultValue = null, onSubmit = null, onCancel = null)
    {
        if (!(graphElement instanceof GraphElement))
            throw new Error('Can only open editor for GraphElements');

        this._target = graphElement;
        this._targetOnSubmit = onSubmit;
        this._targetOnCancel = onCancel;

        if (graphElement instanceof GraphNode)
        {
            const formatter = this.props.labelFormatter.getNodeLabelFormatter();
            this.inputComponent.setFormatter(formatter);
        }
        else if (graphElement instanceof GraphEdge)
        {
            const formatter = this.props.labelFormatter.getEdgeLabelFormatter();
            this.inputComponent.setFormatter(formatter);
        }

        this.setState({ open: true }, () =>
        {
            this.inputComponent.resetValue(defaultValue || '');
            this.inputComponent.focus();
        });
    }

    closeEditor()
    {
        this._target = null;
        this._targetOnSubmit = null;
        this._targetOnCancel = null;

        this.inputComponent.setFormatter(null);

        this.setState({ open: false });
    }

    isEditorOpen()
    {
        return this.state.open;
    }

    getTarget()
    {
        return this._target;
    }

    onInputSubmit(value)
    {
        if (this._targetOnSubmit)
        {
            this._targetOnSubmit(this._target, value);
            //Don't handle cancel callbacks...
            this._targetOnCancel = null;
        }
    }

    onInputBlur(e)
    {
        if (this._targetOnCancel)
        {
            this._targetOnCancel(this._target);
            //Don't handle submit callbacks...
            this._targetOnSubmit = null;
        }
        this.closeEditor();
    }

    /** @override */
    render()
    {
        const isEditorOpen = this.state.open;

        const target = this._target;
        const targetStyle = this.props.style || {};
        const viewport = this.props.viewport;

        if (viewport)
        {
            const viewportAdapter = this.props.viewport.getViewportAdapter();

            if (target)
            {
                const center = target.getCenterPoint();
                const element = viewportAdapter.getElement();
                const parentClientRect = element.getBoundingClientRect();
                const screenPos = transformViewToScreen(
                    element,
                    center.x + viewportAdapter.getOffsetX(),
                    center.y + viewportAdapter.getOffsetY()
                );
                const x = screenPos.x;
                const y = screenPos.y;
                const offsetX = -(this._ref.current.offsetWidth / 2) - parentClientRect.left;
                const offsetY = -(this._ref.current.offsetHeight / 2) - parentClientRect.top;

                targetStyle['top'] = (y + offsetY) + 'px';
                targetStyle['left'] = (x + offsetX) + 'px';
            }
        }

        return (
            <div ref={this._ref}
                id={this.props.id}
                className={Style.editor_container +
                    (isEditorOpen ? ' open ' : '') +
                    ' ' + this.props.className}
                style={targetStyle}>
                <PatternInput ref={ref => this.inputComponent = ref}
                    submitOnBlur={this.props.saveOnExit}
                    onSubmit={this.onInputSubmit}
                    onBlur={this.onInputBlur} />
                <div className={Style.tray_container}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

function transformViewToScreen(svg, x, y)
{
    const ctm = svg.getScreenCTM();
    return {
        x: (x * ctm.a) + ctm.e,
        y: (y * ctm.d) + ctm.f
    };
}

export default LabelEditorWidget;
