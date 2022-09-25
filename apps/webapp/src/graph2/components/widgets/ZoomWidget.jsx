import React from 'react';
import Style from './ZoomWidget.module.css';

import IconButton from 'src/components/IconButton';
import ZoomInIcon from 'src/assets/icons/zoom-in.svg';
import ZoomOutIcon from 'src/assets/icons/zoom-out.svg';

class ZoomWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onZoomIn = this.onZoomIn.bind(this);
        this.onZoomOut = this.onZoomOut.bind(this);
    }

    onZoomIn(e)
    {
        const viewportAdapter = this.props.viewportAdapter;
        const viewScale = -viewportAdapter.getScale() * 0.4;
        viewportAdapter.addScale(viewScale);
    }

    onZoomOut(e)
    {
        const viewportAdapter = this.props.viewportAdapter;
        const viewScale = viewportAdapter.getScale() * 0.75;
        viewportAdapter.addScale(viewScale);
    }

    /** @override */
    render()
    {
        const viewportAdapter = this.props.viewportAdapter;
        const viewScale = 'x' + (1 / (viewportAdapter.getScale() || 1)).toFixed(2);

        return (
            <div id={this.props.id}
                className={Style.zoom_container +
          ' ' + this.props.className}
                style={this.props.style}>
                <IconButton className={Style.zoom_button} title="Zoom In" onClick={this.onZoomIn}>
                    <ZoomInIcon/>
                </IconButton>
                <IconButton className={Style.zoom_button} title="Zoom Out" onClick={this.onZoomOut}>
                    <ZoomOutIcon/>
                </IconButton>
                <label className={Style.zoom_label}>{viewScale}</label>
            </div>
        );
    }
}

export default ZoomWidget;
