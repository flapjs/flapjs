import React from 'react';
import RendererStyle from './Renderer.module.css';

import { EdgeDirectionalLabelRenderer } from './EdgeDirectionalLabelRenderer.jsx';
import { EdgeEndpointNoneRenderer } from './endpoints/EdgeEndpointNoneRenderer.jsx';
import { EdgeEndpointArrowRenderer } from './endpoints/EdgeEndpointArrowRenderer.jsx';

export const ENDPOINT_DIRECTION_FORWARD = 'forward';
export const ENDPOINT_DIRECTION_BACKWARD = 'backward';

const MASK_WIDTH_OFFSET = 8;
const QUAD_RADIAN_THRESHOLD = 0.01;
const QUAD_REVERSE_OFFSET_THRESHOLD = 4;
const HIDDEN_OPACITY = 0.1;
const ZERO = { x: 0, y: 0 };

/**
 * @callback RenderEndpointCallback
 * @param {object} point The position of the endpoint.
 * @param {number} angle The angle of the endpoint (towards the "end" from "center").
 * @param {string} direction Either "forward" or "backward" direction.
 * 
 * @typedef Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @param {object} props
 * @param {RenderEndpointCallback} props.renderEndpoint 
 * @param {Point} [props.start]
 * @param {Point} [props.end]
 * @param {Point} [props.center]
 * @param {string} [props.label]
 * @param {number} [props.labelDirection]
 * @param {boolean} [props.labelKeepUp] When the curve is bent downward, the text (if rotated with
 * the normal), can be flipped upside down. This flips the text to render upward, thereby correcting
 * it (will do it only when necessary). This is only useful if "labelDirection" is set to the
 * edge's normal direction.
 * @param {object} [props.childProps]
 * @param {object} [props.maskProps]
 * @param {object} [props.labelProps]
 * @param {boolean} [props.hidden]
 */
export function EdgeQuadraticRenderer(props) {
    const {
        renderEndpoint,
        start = ZERO, end = ZERO, center = ZERO,
        label = '',
        labelDirection = 0,
        labelKeepUp = false,
        childProps = {},
        maskProps = {},
        labelProps = {},
        hidden = false
    } = props;

    let fromPoint = start;
    let toPoint = end;
    let centerPoint = center;

    let invertLabel = false;
    let fromAngle;
    let toAngle;
    let quadLine;

    const dftx = fromPoint.x - toPoint.x;
    const dfty = fromPoint.y - toPoint.y;
    const dfcx = fromPoint.x - centerPoint.x;
    const dfcy = fromPoint.y - centerPoint.y;
    const ftrad = Math.atan2(dfty, dftx);
    const fcrad = Math.atan2(dfcy, dfcx);
    if (Math.abs(ftrad - fcrad) <= QUAD_RADIAN_THRESHOLD) {
        toAngle = Math.atan2(centerPoint.x - toPoint.x, centerPoint.y - toPoint.y) + Math.PI;
        fromAngle = Math.atan2(centerPoint.x - fromPoint.x, centerPoint.y - fromPoint.y) + Math.PI;
        quadLine = `L ${toPoint.x} ${toPoint.y}`;
    } else {
        const cx = ((centerPoint.x * 4) - fromPoint.x - toPoint.x) / 2;
        const cy = ((centerPoint.y * 4) - fromPoint.y - toPoint.y) / 2;
        toAngle = Math.atan2(cx - toPoint.x, cy - toPoint.y) + Math.PI;
        fromAngle = Math.atan2(cx - fromPoint.x, cy - fromPoint.y) + Math.PI;
        quadLine = `Q ${cx} ${cy} ${toPoint.x} ${toPoint.y}`;
        if (labelKeepUp) invertLabel = cy > centerPoint.y + QUAD_REVERSE_OFFSET_THRESHOLD;
    }

    const pathData = `M ${fromPoint.x} ${fromPoint.y} ${quadLine}`;
    return (
        <g style={{ opacity: hidden ? HIDDEN_OPACITY : 1 }}>
            <path className={RendererStyle.decorative}
                d={pathData} fill="none"
                {...childProps} />
            <path className={RendererStyle.mask}
                d={pathData} style={{ fill: 'none' /* For some reason, only this will override default styles. */ }}
                strokeWidth={`${MASK_WIDTH_OFFSET}px`}
                {...maskProps} />
            {renderEndpoint
                ? renderEndpoint(toPoint, toAngle, ENDPOINT_DIRECTION_FORWARD)
                : <EdgeEndpointArrowRenderer
                    x={toPoint.x} y={toPoint.y}
                    angle={toAngle} />}
            {renderEndpoint
                ? renderEndpoint(fromPoint, fromAngle, ENDPOINT_DIRECTION_BACKWARD)
                : <EdgeEndpointNoneRenderer
                    x={fromPoint.x} y={fromPoint.y}
                    angle={fromAngle} />}
            <EdgeDirectionalLabelRenderer
                x={centerPoint.x} y={centerPoint.y}
                label={label}
                textDirection={labelDirection}
                invertText={invertLabel}
                maskProps={labelProps} />
        </g>
    );
}
