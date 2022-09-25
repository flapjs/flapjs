import React from 'react';
import Style from './NotificationView.module.css';

import DefaultNotificationLayout from './DefaultNotificationLayout';

class NotificationView extends React.Component {
  constructor(props) {
    super(props);
  }

  /** @override */
  render() {
    const notificationManager = this.props.notificationManager;
    return (
      <div
        id={this.props.id}
        className={Style.notifications_container + ' ' + this.props.className}
        style={this.props.style}>
        {notificationManager.getNotifications().map((notification) => {
          const layoutID = notification.getLayoutID();
          const NotificationLayout = layoutID
            ? notificationManager.getNotificationLayout(layoutID)
            : DefaultNotificationLayout;
          return (
            <NotificationLayout
              key={notification.getID()}
              notification={notification}
              message={notification.getMessage()}
              {...notification.getProps()}
            />
          );
        })}
      </div>
    );
  }
}

export default NotificationView;
