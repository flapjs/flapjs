import React from 'react';

class WarningIcon extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <svg className="warning-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>;
    }
}

export default WarningIcon;
