import React from 'react';
import { LocaleString } from 'src/libs/i18n';

import Style from './DefaultNotificationLayout.module.css';

class SequenceNotificationLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  /** @override */
  render() {
    const { message, notification, onClick, ...props } = this.props;

    return (
      <div className={Style.notification_container} {...props}>
        {message &&
          message.split('\n').map((e, i) => <p key={e + ':' + i}>{e}</p>)}
        {this.props.children}
        <button style={{ marginBottom: '1em' }} onClick={onClick}>
          <LocaleString entity="message.action.next"/>
        </button>
        {notification && (
          <button onClick={(e) => notification.close()}>
            <LocaleString entity="message.action.close"/>
          </button>
        )}
      </div>
    );
  }
}

export default SequenceNotificationLayout;
