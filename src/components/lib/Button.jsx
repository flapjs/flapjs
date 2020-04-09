import React from 'react';
import PropTypes from 'prop-types';

import Style from './Button.module.css';

export default function Button(props)
{
    const { className, id, title, disabled, onClick } = props;

    return (
        <button className={`${Style.element} ${className}`}
            id={id}
            onClick={onClick}
            title={title}
            disabled={disabled}>
            {props.children || title}
        </button>
    );
}
Button.propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
    disabled: PropTypes.bool,
};
