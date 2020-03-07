import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@flapjs/components2/drawer/pane/Pane.jsx';

import IconButton from '@flapjs/components2/icons/IconButton.jsx';
import { RunningManIcon } from '@flapjs/components2/icons/Icons.js';

class AboutPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <Pane>
                Hello!
            </Pane>
        );
    }
}
AboutPanel.Tab = Tab;

function Tab(props)
{
    const { onClick, ...otherProps } = props;
    return (
        <IconButton
            onClick={onClick}
            iconClass={RunningManIcon}
            {...otherProps}/>
    );
}
Tab.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default AboutPanel;
