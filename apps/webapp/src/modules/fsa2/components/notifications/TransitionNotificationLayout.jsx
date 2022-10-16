import React, { useState } from 'react';
import DefaultNotificationLayout, {
  STYLE_TYPE_ERROR,
} from 'src/session/manager/notification/components/DefaultNotificationLayout';
import GraphNode from 'src/graph2/element/GraphNode';
import { LocaleString } from 'src/libs/i18n';
import { locateTarget } from './NotificationHelper';

const ARROW = '\u2192';

export default function TransitionNotificationLayout(props) {
  const [targetIndex, setTargetIndex] = useState(0);
  const targetLabel = props.message.targets
    .map(t => `(${t.getEdgeFrom().getNodeLabel()}`
      + `, ${t.getEdgeLabel()})${ARROW} `
      + `${(t.getEdgeTo() instanceof GraphNode
        ? t.getEdgeTo().getNodeLabel()
        : 'null')}`)
    .join(', ');

  function onClick(e) {
    const notification = props.notification;
    const message = props.message;
    const app = props.app;

    const graphController = props.graphController;

    switch (e.target.value) {
      case 'locate':
        locateTarget(app, message.targets, targetIndex, setTargetIndex);
        break;
      case 'deleteall':
        {
          const targets = message.targets;
          //Delete all target edges
          graphController.deleteTargetEdges(targets);

          //Exit the message
          notification.close();
        }
        break;
    }
  }

  return (
    <DefaultNotificationLayout
      id={props.id}
      className={props.className}
      style={props.style}
      styleType={STYLE_TYPE_ERROR}
      notification={props.notification}>
      <p>
        {props.message.text || <LocaleString entity={props.message.unlocalized}/>}
        {': ' + targetLabel}
      </p>
      <button value="locate" onClick={onClick}>
        <LocaleString entity="message.action.locate"/>
      </button>
      <button value="deleteall" onClick={onClick}>
        <LocaleString entity="message.action.deleteall"/>
      </button>
    </DefaultNotificationLayout>
  );
}
