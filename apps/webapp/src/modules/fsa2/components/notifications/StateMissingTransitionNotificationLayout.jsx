import React from 'react';
import { useState } from 'react';
import { LocaleString } from 'src/libs/i18n';
import DefaultNotificationLayout, {
  STYLE_TYPE_ERROR,
} from 'src/session/manager/notification/components/DefaultNotificationLayout';
import { locateTarget } from './NotificationHelper';

export default function StateMissingTransitionNotificationLayout(props) {
  const [targetIndex, setTargetIndex] = useState(0);
  const targetLabel = props.message.targets
    .map(t => t.getNodeLabel())
    .join(', ')
    + ' for ' + props.message.symbol;

  function onClick(e) {
    const message = props.message;
    const app = props.app;
    switch (e.target.value) {
      case 'locate':
        locateTarget(app, message.targets, targetIndex, setTargetIndex);
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
        <LocaleString entity="message.error.missing" />
        {': ' + targetLabel}
      </p>
      <button value="locate" onClick={onClick}>
        <LocaleString entity="message.action.locate" />
      </button>
    </DefaultNotificationLayout>
  );
}
