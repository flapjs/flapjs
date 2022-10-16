import React from 'react';
import Style from './PanelList.module.css';

export default function PanelList(props) {
  return (
    <div
      id={props.id}
      className={Style.panel_content + ' ' + props.className}
      style={props.style}>
      {props.children}
    </div>
  );
}
