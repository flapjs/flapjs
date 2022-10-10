import React from 'react';
import { LocaleString } from 'src/libs/i18n';
import DefaultNotificationLayout, {
  STYLE_TYPE_ERROR,
} from 'src/session/manager/notification/components/DefaultNotificationLayout';

// TODO: add @see for usage
class StateMissingTransitionNotificationLayout extends React.Component {
  constructor(props) {
    super(props);

    // TODO: check to see if these variables are used elsewhere; otherwise make it private
    this.targetIndex = 0;
    this.targetLabel = '';
    // TODO: clarify what target is, specify type
    const targets = props.message.targets;
    for (const target of targets) {
      if (this.targetLabel.length > 0) {
        this.targetLabel += ', ';
      }
      this.targetLabel += target.getNodeLabel();
    }
    // TODO: fix "for" - not language compatible
    this.targetLabel += ' for ' + props.message.symbol;

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    // const notification = this.props.notification;
    const message = this.props.message;
    const app = this.props.app;

    switch (e.target.value) {
      case 'locate':
        {
          const targets = message.targets;
          const targetLength = targets.length;
          if (targetLength > 0 && this.targetIndex < targetLength) {
            //Locate the target edge
            const target = targets[this.targetIndex++];
            if (this.targetIndex >= targetLength) this.targetIndex = 0;

            //Move pointer to target
            const graphView = app
              .getSession()
              .getCurrentModule()
              .getGraphView();
            graphView.moveViewToPosition(target.x, target.y);
          }
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
        styleType={STYLE_TYPE_ERROR}
        notification={this.props.notification}>
        <p>
          <LocaleString entity="message.error.missing"/>
          {': ' + this.targetLabel}
        </p>
        <button value="locate" onClick={this.onClick}>
          <LocaleString entity="message.action.locate"/>
        </button>
      </DefaultNotificationLayout>
    );
  }
}

export default StateMissingTransitionNotificationLayout;
