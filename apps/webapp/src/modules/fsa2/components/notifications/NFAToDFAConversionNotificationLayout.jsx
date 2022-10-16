import React from 'react';
import { LocaleString } from 'src/libs/i18n';
import DefaultNotificationLayout, {
  STYLE_TYPE_WARNING,
} from 'src/session/manager/notification/components/DefaultNotificationLayout';

// TODO: specify what the class does
export default function NFAToDFAConversionNotificationLayout(props) {
  function onClick(e) {
    const notification = props.notification;
    // TODO: specify what e is
    switch (e.target.value) {
      case 'convert':
        {
          //FIXME: FSABUILDER: convertMachineTo needs to change?
          const machineController = props.machineController;
          machineController.convertMachineTo('DFA');
          notification.close();
        }
        break;
    }
  }

  // TODO: clarify machineController?
  const machineController = props.machineController;
  const stateCount = machineController.countStates();

  return (
    <DefaultNotificationLayout
      id={props.id}
      className={props.className}
      style={props.style}
      styleType={STYLE_TYPE_WARNING}
      notification={props.notification}>
      <p>
        <LocaleString entity="message.warning.convertNFAToDFA" />
      </p>
      <p>{`${stateCount} states -> ${Math.pow(2, stateCount)} states`}</p>
      <button value="convert" onClick={onClick}>
        <LocaleString entity="message.action.convert" />
      </button>
    </DefaultNotificationLayout>
  );
}
