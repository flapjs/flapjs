import React, { useState } from 'react';
import { LocaleString } from 'src/libs/i18n';
import DefaultNotificationLayout, {
  STYLE_TYPE_ERROR,
} from 'src/session/manager/notification/components/DefaultNotificationLayout';
import { locateTarget } from './NotificationHelper';

/**
 * A class representing the layout for a notification referring to states
 */
export default function StateNotificationLayout(props) {
  const [targetIndex, setTargetIndex] = useState(0);
  const targetLabel = props.message
    .map(t => t.getNodeLabel())
    .join(', ');

  /**
   * Handles onclick events for the buttons
   */
  function onClick(e) {
    const notification = props.notification;
    const message = props.message;
    const app = props.app;

    const graphController = props.graphController;

    switch (e.target.value) {
      // Cycle through all of the targets and center the viewport on it
      case 'locate':
        locateTarget(app, message.targets, targetIndex, setTargetIndex);
        break;
      // Delete all targets
      case 'deleteall':
        {
          const targets = message.targets;
          // Delete all target nodes
          graphController.deleteTargetNodes(targets);
          // Sort the nodes after deleting if enabled...
          graphController.applyAutoRename();
          // Exit the message
          notification.close();
        }
        break;
    }
  }

  const message = props.message;

  // TODO: localization issues
  return (
    <DefaultNotificationLayout
      id={props.id}
      className={props.className}
      style={props.style}
      styleType={STYLE_TYPE_ERROR}
      notification={props.notification}>
      <p>
        {message.text || <LocaleString entity={message.unlocalized}/>}
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
