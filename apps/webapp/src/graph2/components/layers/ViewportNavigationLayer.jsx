import React from 'react';
import Style from './ViewportNavigationLayer.module.css';

import ZoomWidget from '../widgets/ZoomWidget';
import FocusCenterWidget from '../widgets/FocusCenterWidget';

class ViewportNavigationLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const viewportAdapter = this.props.viewportAdapter;

        return (
            <div id={this.props.id}
                className={Style.navbar_container +
					' ' + this.props.className}
                style={this.props.style}>
                <ZoomWidget className={Style.navbar_widget_container}
                    viewportAdapter={viewportAdapter} />
                <FocusCenterWidget className={Style.navbar_widget}
                    viewportAdapter={viewportAdapter} />
                {this.props.children}
            </div>
        );
    }
}

export default ViewportNavigationLayer;