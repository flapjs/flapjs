import React from 'react';
import Style from './ModeTrayWidget.module.css';

import IconButton from 'src/components/IconButton';
import EditPencilIcon from 'src/assets/icons/pencil.svg';
import MoveIcon from 'src/assets/icons/move.svg';
import { LocaleConsumer } from 'src/libs/i18n';

export const MODE_ACTION = 0;
export const MODE_MOVE = 1;

class ModeTrayWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  /** @override */
  render() {
    const visible = this.props.visible;
    const mode = this.props.mode;
    const onChange = this.props.onChange;
    const hide = !visible;

    return (
      <div
        id={this.props.id}
        className={
          Style.tray_container +
          (hide ? ' hide ' : '') +
          ' ' +
          this.props.className
        }
        style={this.props.style}>
          <LocaleConsumer>
            {locale => (
              <>
              <IconButton
                className={
                  Style.tray_button + (mode === MODE_ACTION ? ' active ' : '')
                }
                onClick={() => {
                  if (onChange) onChange(MODE_ACTION);
                }}
                title={locale.getLocaleString('cursor.actionmode')}>
                <EditPencilIcon />
              </IconButton>
              <IconButton
                className={Style.tray_button + (mode === MODE_MOVE ? ' active ' : '')}
                onClick={() => {
                  if (onChange) onChange(MODE_MOVE);
                }}
                title={locale.getLocaleString('cursor.movemode')}>
                <MoveIcon />
              </IconButton>
              </>
            )}
          </LocaleConsumer>
      </div>
    );
  }
}
export default ModeTrayWidget;
