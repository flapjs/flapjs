import React from 'react';
import RendererStyle from '../Renderer.module.css';

const HALF_PI = Math.PI / 2;
const MASK_OFFSET_RATIO = 0.7;

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.angle]
 * @param {number} [props.length]
 * @param {object} [props.maskProps]
 */
export function EdgeEndpointNoneRenderer(props) {
    const {
        x = 0, y = 0, angle = 0, length = 10,
        maskProps = {}
    } = props;
    return (
        <>
        <circle className={RendererStyle.mask}
            cx={x - (length * Math.cos(-angle + HALF_PI) * MASK_OFFSET_RATIO)}
            cy={y - (length * Math.sin(-angle + HALF_PI) * MASK_OFFSET_RATIO)}
            r={length}
            {...maskProps} />
        </>
    );
}
