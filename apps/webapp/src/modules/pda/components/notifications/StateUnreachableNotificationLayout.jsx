import React from 'react';
import { LocaleString } from 'src/libs/i18n';
import DefaultNotificationLayout, {
  STYLE_TYPE_WARNING,
} from 'src/session/manager/notification/components/DefaultNotificationLayout';

class StateUnreachableNotificationLayout extends React.Component {
  constructor(props) {
    super(props);

    this.targetIndex = 0;
    this.targetLabel = '';
    const targets = props.message;
    for (const target of targets) {
      if (this.targetLabel.length > 0) {
        this.targetLabel += ', ';
      }
      this.targetLabel += target.getNodeLabel();
    }

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    const notification = this.props.notification;
    const message = this.props.message;
    const graphController = this.props.graphController;

    switch (e.target.value) {
      case 'locate':
        {
          //Locate the target node
          const target = message[this.targetIndex++];
          if (this.targetIndex >= message.length) {
            this.targetIndex = 0;
          }

          //Move pointer to target
          graphController.focusOnNode(target);
        }
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

  /** @override */
  render() {
    return (
      <DefaultNotificationLayout
        id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        styleType={STYLE_TYPE_WARNING}
        notification={this.props.notification}>
        <p>
          <LocaleString entity="message.warning.unreachable"/>
          {': ' + this.targetLabel}
        </p>
        <button value="locate" onClick={this.onClick}>
          <LocaleString entity="message.action.locate"/>
        </button>
        <button value="deleteall" onClick={this.onClick}>
          <LocaleString entity="message.action.deleteall"/>
        </button>
      </DefaultNotificationLayout>
    );
  }
}

export default StateUnreachableNotificationLayout;
