import React from 'react';

import Config from 'config.js';

class NodeRenderer extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    //TODO: Refer to app.css for comparable colors
    const node = this.props.node;
    return <g className="graph-node-container">
      {/*Outer circle*/}
      <circle className="graph-node"
        cx={node.x}
        cy={node.y}
        r={Config.NODE_RADIUS}

        fill="#FEE781"
        stroke="#000000"/>

      {/*Inner circle*/}
      {node.accept &&
        <circle className="graph-node-inner"
          cx={node.x}
          cy={node.y}
          r={Config.NODE_RADIUS_INNER}
          fill="none"

          stroke="#000000"/>}

      //Label
      <text className="graph-node-label"
        x={node.x} y={node.y + 4}
        pointerEvents="none"
        style={{
          userSelect: "none",
          fontSize: (1 - Math.min(Math.max(node.label.length - 2, 0) / 6, 0.5)) + "em"
        }}

        fontFamily="\'Overpass Mono\', monospace"
        textAnchor="middle">
        {node.label}
      </text>
    </g>;
  }
}

export default NodeRenderer;
