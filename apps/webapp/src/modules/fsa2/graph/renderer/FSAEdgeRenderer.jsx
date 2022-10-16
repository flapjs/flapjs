import React from 'react';

import EdgeRenderer, {
  DIRECTED_FORWARD,
} from 'src/graph2/renderer/EdgeRenderer';

import { SYMBOL_SEPARATOR } from '../element/FSAEdge';

export default function FSAEdgeRenderer(props) {
  const edge = props.edge;
  const stroke = props.stroke;
  const onMouseOver = props.onMouseOver;
  const onMouseOut = props.onMouseOut;
  const pointerEvents = props.pointerEvents;

  const start = edge.getStartPoint();
  const end = edge.getEndPoint();
  const center = edge.getCenterPoint();
  const label = edge.getEdgeLabel();
  const edgeDir = edge.getEdgeDirection();

  return (
    <EdgeRenderer
      directed={DIRECTED_FORWARD}
      from={start}
      to={end}
      center={center}
      label={label.split(SYMBOL_SEPARATOR).join('\n')}
      direction={edgeDir}
      color={stroke}
      onMouseOver={
        onMouseOver
          ? (e) => {
            const value = e.target['value'] || (e.target['value'] = {});
            value.source = edge;
            onMouseOver(e);
          }
          : null
      }
      onMouseOut={
        onMouseOut
          ? (e) => {
            const value = e.target['value'] || (e.target['value'] = {});
            value.source = edge;
            onMouseOut(e);
          }
          : null
      }
      pointerEvents={pointerEvents}/>
  );
}
