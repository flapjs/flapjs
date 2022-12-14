import React from 'react';
import Style from './ToolbarView.module.css';

import ToolbarTitle from './ToolbarTitle';

import IconButton from 'src/components/IconButton';
import MenuIcon from 'src/assets/icons/menu.svg';
import CrossIcon from 'src/assets/icons/cross.svg';
import { Slot } from 'src/libs/slot';

const TOOLBAR_ALLOW_MENU_BAR = true;
const TOOLBAR_DEFAULT_MENU_INDEX = 0;

class ToolbarView extends React.Component {
  constructor(props) {
    super(props);

    this.ref = null;
    this.toolbarElement = null;

    this.state = {
      open: false,
      menuIndex: TOOLBAR_DEFAULT_MENU_INDEX,
    };

    this.onBarExpand = this.onBarExpand.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  openBar(callback = null) {
    if (!this.state.open) {
      //Open it, but also reset menu...
      this.setState(
        { open: true, menuIndex: TOOLBAR_DEFAULT_MENU_INDEX },
        callback
      );
    }
  }

  closeBar(callback = null) {
    if (this.state.open) {
      //Close it, but also reset menu...
      this.setState(
        { open: false, menuIndex: TOOLBAR_DEFAULT_MENU_INDEX },
        callback
      );
    }
  }

  toggleBar(callback = null) {
    this.setState((prev, props) => {
      return { open: !prev.open };
    }, callback);
  }

  isBarOpen() {
    return this.state.open;
  }

  setCurrentMenu(menuIndex) {
    //Open and set tab index
    this.setState({ open: true, menuIndex: menuIndex });
  }

  getCurrentMenuIndex() {
    return this.state.menuIndex;
  }

  isCurrentMenu(menuIndex) {
    return this.state.menuIndex === menuIndex;
  }

  onBarExpand(e) {
    this.toggleBar();
  }

  onTitleChange(value) {
    this.props.session.setProjectName(value);
  }

  /** @override */
  render() {
    const title = this.props.title;
    const onTitleClick = this.props.onTitleClick;

    const session = this.props.session;

    const hasButtons = React.Children.count(this.props.children) > 0;
    const isBarOpen = this.state.open;
    const shouldBarHide = this.props.hide || false;
    const showBarExpander = isBarOpen || (hasButtons && TOOLBAR_ALLOW_MENU_BAR);

    const { renderMenu, renderBar, renderSubtitle } = this.props;

    return (
      <div
        ref={(ref) => (this.ref = ref)}
        id={this.props.id}
        className={
          Style.app_bar +
          (isBarOpen ? ' open ' : '') +
          (shouldBarHide ? ' hide ' : '') +
          ' ' +
          this.props.className
        }
        style={this.props.style}>
        <div className={Style.bar_menu}>
          <div className={Style.menu_container}>
            <Slot name="menu" onSlotted={(Component, props, children, key, index) => {
              const current = this.isCurrentMenu(index);
              return (
                <div key={key} className={Style.menu_panel_container
                  + (!current ? ' hide ' : '')}>
                  <Component {...props} {...this.props.menuProps} toolbar={this}/>
                </div>
              );
            }}/>
          </div>
          <div className={Style.menu_button_container}>
            {renderMenu()}
          </div>
        </div>
        <div
          ref={(ref) => (this.toolbarElement = ref)}
          className={Style.bar_toolbar}>
          <ToolbarTitle
            className={Style.toolbar_title}
            title={title}
            defaultValue={session.getProjectName()}
            onChange={this.onTitleChange}
            onClick={onTitleClick}>
            {renderSubtitle()}
          </ToolbarTitle>

          <div className={Style.toolbar_button_container}>
            {renderBar()}
          </div>

          {showBarExpander && isBarOpen ? (
            <IconButton
              className={Style.toolbar_expander}
              onClick={this.onBarExpand}
              title="Back">
              <CrossIcon />
            </IconButton>
          ) : (
            <IconButton
              className={Style.toolbar_expander}
              onClick={this.onBarExpand}
              title="Menu">
              <MenuIcon />
            </IconButton>
          )}
        </div>
      </div>
    );
  }
}
export default ToolbarView;

export function AboutMenu(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <h1>Flap.js</h1>
        <p>Something cool will be here soon. ;)</p>
        <p>Have an awesome day!</p>
      </div>
      <div>
        <h3>Found a bug or have a cool idea?</h3>
        <p>
          Feel free to leave a comment or any feedback in{' '}
          <b>
            {'"'}Report a Bug{'"'}
          </b>
          .
        </p>
        <p>
          It{"'"}s for both <b>bugs</b> and <b>suggestions</b>!
        </p>
        <p style={{ marginTop: '3em' }}>
          And if you are at all interested in what we do and would
          like to join the team, please contact us!
        </p>
      </div>
    </div>
  );
}