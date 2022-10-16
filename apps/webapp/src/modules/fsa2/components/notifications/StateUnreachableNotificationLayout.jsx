import React from 'react';
import { useState } from 'react';
import { LocaleString } from 'src/libs/i18n';
import DefaultNotificationLayout, {
  STYLE_TYPE_WARNING,
} from 'src/session/manager/notification/components/DefaultNotificationLayout';
import { locateTarget } from './NotificationHelper';

export default function StateUnreachableNotificationLayout(props) {
  const [targetIndex, setTargetIndex] = useState(0);
  const targetLabel = props.message
    .map(t => t.getNodeLabel())
    .join(', ');

  function onClick(e) {
    const notification = props.notification;
    const message = props.message;
    const app = props.app;
    const graphController = props.graphController;

    switch (e.target.value) {
      case 'locate':
        locateTarget(app, message, targetIndex, setTargetIndex);
        break;
      case 'deleteall':
        {
          const targets = message;
          //Delete all target nodes
          graphController.deleteTargetNodes(targets);

          //Sort the nodes after deleting if enabled...
          graphController.applyAutoRename();

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
      styleType={STYLE_TYPE_WARNING}
      notification={props.notification}>
      <p>
        <LocaleString entity="message.warning.unreachable" />
        {': ' + targetLabel}
      </p>
      <button value="locate" onClick={onClick}>
        <LocaleString entity="message.action.locate" />
      </button>
      <button value="deleteall" onClick={onClick}>
        <LocaleString entity="message.action.deleteall" />
      </button>
    </DefaultNotificationLayout>
  );
}
