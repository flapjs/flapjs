import React from 'react';
import Style from './PanelButton.module.css';

export default function PanelButton(props) {
  return (
    <button
      id={props.id}
      className={Style.button_container + ' ' + props.className}
      disabled={props.disabled}
      style={props.style}
      onClick={props.onClick}>
      {props.children}
    </button>
  );
}
