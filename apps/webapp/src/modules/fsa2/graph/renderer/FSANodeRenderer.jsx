import React from 'react';

import { NodeCircleRenderer } from 'src/modules/fsa2/experimental/renderers/NodeCircleRenderer.jsx';

/**
 * @param {object} props
 */
export default function FSANodeRenderer(props) {
  const {
    node,
    fill,
    stroke,
    onMouseOver,
    onMouseOut,
    pointerEvents,
  } = props;

  const label = node.getNodeLabel();
  const radius = node.getNodeSize();
  const accept = node.getNodeAccept();
  
  return (
    <NodeCircleRenderer
      x={node.x} y={node.y}
      radius={radius}
      label={label}
      inner={accept ? radius * 0.8 : undefined}
      maskProps={{
        onMouseOut: onMouseOut
          ? (e) => {
            const value = e.target.value || (e.target.value = {});
            value.source = node;
            value.type = 'node';
            onMouseOut(e);
          }
          : null,
        onMouseOver: onMouseOver
          ? (e) => {
            const value = e.target.value || (e.target.value = {});
            value.source = node;
            value.type = 'node';
            onMouseOver(e);
          }
          : null,
        pointerEvents,
      }}
      styleProps={{
        fill,
        stroke,
      }}
      labelProps={{
        fill: stroke,
        stroke: 'none',
      }}/>
  );
}
