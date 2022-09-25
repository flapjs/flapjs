import React from 'react';
import './StatusButton.css';

import IconButton from 'src/app/deprecated/icons/IconButton';
import SuccessIcon from 'src/assets/icons/circle-check.svg';
import FailureIcon from 'src/assets/icons/circle-cross.svg';
import RunningManIcon from 'src/assets/icons/man-running.svg';

class StatusButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const active = this.props.active;
        if (this.props.mode === true)
        {
            //Success icon
            return <IconButton className={'status-icon success' + (active ? ' active' : '')}
                onClick={this.props.onClick}>
                <SuccessIcon/>
            </IconButton>;
        }
        else if (this.props.mode === false)
        {
            //Failure icon
            return <IconButton className={'status-icon failure' + (active ? ' active' : '')}
                onClick={this.props.onClick}>
                <FailureIcon/>
            </IconButton>;
        }
        else
        {
            //Pending icon
            return <IconButton className={'status-icon' + (active ? ' active' : '')}
                onClick={this.props.onClick}>
                <RunningManIcon/>
            </IconButton>;
        }
    }
}

export default StatusButton;
