import React from 'react';
import Style from './FullscreenWidget.module.css';

import IconStateButton from 'src/app/experimental/components/IconStateButton';
import FullscreenIcon from 'src/app/components/iconset/FullscreenIcon';
import FullscreenExitIcon from 'src/app/components/iconset/FullscreenExitIcon';

class FullscreenWidget extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const app = this.props.app;

        return (
            <IconStateButton id={this.props.id}
                className={Style.fullscreen_button + ' ' + this.props.className}
                style={this.props.style}
                title={'Fullscreen Mode'}
                onClick={(e, i) => app.setState({hide: (i === 0)})}>
                <FullscreenIcon/>
                <FullscreenExitIcon/>
            </IconStateButton>
        );
    }
}

export default FullscreenWidget;
