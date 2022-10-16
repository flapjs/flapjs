import React from 'react';
import Style from './SideBarLayout.module.css';

import * as SideHelper from './SideHelper.js';

/**
 * 
 * @param {object} props 
 * @param {string} [props.className]
 * @param {object} [props.style]
 * @param {React.ReactNode} [props.children]
 * @param {React.FC} props.sideBar
 * @param {'left'|'right'|'top'|'bottom'} [props.side]
 * @param {number|string} [props.sideMargin]
 * @param {'hidden'|'auto'} [props.viewOverflow]
 */
export function SideBarLayout(props) {
    const {
        className = '',
        style = {},
        side = 'left',
        sideBar,
        sideMargin = 'auto',
        viewOverflow = 'hidden'
    } = props;

    const containerFlexDirection = (
        side === 'left'
            ? 'row'
            : side === 'right'
                ? 'row-reverse'
                : side === 'top'
                    ? 'column'
                    : 'column-reverse'
    );

    const contentFlexDirection = (
        SideHelper.isHorizontal(side)
            ? 'column'
            : 'row'
    );

    const cssVars = {
        '--side-margin': sideMargin,
    };

    return (
        <div className={`${Style.container} ${className || ''}`}
            style={{ flexDirection: containerFlexDirection, ...cssVars, ...style }}>
            <div className={`${Style.sideBar} ${side}`}>
                <div className={`${Style.sideContent}`}
                    style={{ flexDirection: contentFlexDirection }}>

                    {renderSideBarContent(sideBar, side)}

                </div>
            </div>
            <div className={Style.viewport}
                style={{ overflow: viewOverflow }}>
                {props.children}
            </div>
        </div>
    );
}

function renderSideBarContent(sideBar, side) {
    if (typeof sideBar === 'function') {
        return sideBar(side);
    }
    else {
        return (
            <div>
                {sideBar}
            </div>
        );
    }
}
