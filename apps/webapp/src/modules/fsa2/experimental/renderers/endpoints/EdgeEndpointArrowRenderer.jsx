import React from 'react';
import RendererStyle from '../Renderer.module.css';

const SIXTH_PI = Math.PI / 6;
const HALF_PI = Math.PI / 2;
const MASK_OFFSET_RATIO = 0.7;

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.angle]
 * @param {number} [props.length]
 * @param {object} [props.childProps]
 * @param {object} [props.maskProps]
 */
export function EdgeEndpointArrowRenderer(props) {
    const {
        x = 0, y = 0,
        angle = 0,
        length = 10,
        childProps = {},
        maskProps = {},
    } = props;
    return (
        <>
        <path className={RendererStyle.decorative}
            d={`M ${(x - (length * Math.sin(angle - SIXTH_PI)))}` +
                ` ${(y - (length * Math.cos(angle - SIXTH_PI)))}` +
                ` L ${x} ${y}` +
                ` L ${(x - (length * Math.sin(angle + SIXTH_PI)))}` +
                ` ${(y - (length * Math.cos(angle + SIXTH_PI)))}`}
            fill="none"
            {...childProps} />
        <circle className={RendererStyle.mask}
            cx={x - (length * Math.cos(-angle + HALF_PI) * MASK_OFFSET_RATIO)}
            cy={y - (length * Math.sin(-angle + HALF_PI) * MASK_OFFSET_RATIO)}
            r={length}
            {...maskProps} />
        </>
    );
}
