import React from 'react';
import RendererStyle from './Renderer.module.css';

const MASK_RADIUS_OFFSET = 4;

/**
 * @param {object} props 
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.radius]
 * @param {number} [props.inner]
 * @param {string} [props.label]
 * @param {object} [props.childProps]
 * @param {object} [props.maskProps]
 * @param {object} [props.styleProps]
 * @param {object} [props.labelProps]
 */
export function NodeCircleRenderer(props) {
    const {
        x = 0, y = 0,
        radius = 15,
        inner = 0,
        label = '',
        childProps = {},
        maskProps = {},
        styleProps = {},
        labelProps = {}
    } = props;
    const labels = label && label.split('\n');
    return (
        <>
        <circle className={RendererStyle.decorative}
            cx={x} cy={y} r={radius}
            {...styleProps}
            {...childProps}/>
        { inner &&
        <circle className={RendererStyle.decorative}
            cx={x} cy={y} r={inner}
            {...styleProps} /> }
        {labels && labels.length > 0 && labels.map((s, i) => (
            <text className={RendererStyle.decorative}
                key={`${s}:${i}`}
                x={x} y={y}
                transform={`translate(0 ${(i * 14)})`}
                style={{
                    fontFamily: 'monospace',
                    fontSize: `${magicFontSize(s.length)}em`,
                }}
                alignmentBaseline="middle"
                textAnchor="middle"
                {...styleProps}
                {...labelProps}>
                {s}
            </text>
        ))}
        <circle className={RendererStyle.mask}
            cx={x} cy={y} r={radius + MASK_RADIUS_OFFSET}
            {...maskProps}/>
        </>
    );
}

// NOTE: Configured for `monospace` font.
function magicFontSize(labelLength) {
    return (1 - Math.min(Math.max(labelLength, 0) / 8, 0.7)) * 1.5;
}
