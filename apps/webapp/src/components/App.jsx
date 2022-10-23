import React from 'react';
import Style from './App.module.css';

import DrawerView, {
  DRAWER_SIDE_RIGHT,
  DRAWER_SIDE_BOTTOM,
  DRAWER_BAR_DIRECTION_VERTICAL,
  DRAWER_BAR_DIRECTION_HORIZONTAL,
} from 'src/components/drawer/DrawerView';
import TooltipView from 'src/components/tooltip/TooltipView';
import UploadDropZone from 'src/components/UploadDropZone';
import NotificationView from 'src/session/manager/notification/components/NotificationView';
import IconButton from 'src/components/IconButton';
import FullscreenWidget from 'src/components/FullscreenWidget';
import { registerAppStyles } from './AppStyles';

import ExportManager from 'src/util/file/export/ExportManager';
import ImportManager from 'src/util/file/import/ImportManager';

import ViewportManager from 'src/session/manager/ViewportManager';
import HotKeyManager, {
  CTRL_KEY,
  SHIFT_KEY,
} from 'src/session/manager/hotkey/HotKeyManager';
import HotKeyView from 'src/session/manager/hotkey/HotKeyView';
import TooltipManager from 'src/session/manager/TooltipManager';
import NotificationManager from 'src/session/manager/notification/NotificationManager';
import ThemeManager from 'src/util/theme/ThemeManager';
import BroadcastManager from 'src/session/manager/broadcast/BroadcastManager';
import Broadcast from 'src/util/broadcast/Broadcast';
import { Slot } from 'src/libs/slot/Slot';
import { LocaleConsumer } from 'src/libs/i18n';

import { AppBar } from 'src/components/appbar/AppBar';
import TutorialHandler from 'src/modules/fsa2/TutorialHandler';

const BROADCAST_CHANNEL_ID = 'fla';

class App extends React.Component {
  constructor(props) {
    super(props);

    App.INSTANCE = this;

    this._toolbarComponent = React.createRef();
    this._drawerComponent = React.createRef();
    this._viewport = null;
    this._labeleditor = null;

    this._themeManager = new ThemeManager();
    this._locale = null;

    this._exportManager = new ExportManager();
    this._importManager = new ImportManager();

    this._hotKeyManager = new HotKeyManager();
    this._viewportManager = new ViewportManager();
    this._tooltipManager = new TooltipManager();
    this._notificationManager = new NotificationManager();
    this._broadcastManager = new BroadcastManager(this);

    this._tutorialHandler = new TutorialHandler();

    this._session = props.session
      .addListener(this._hotKeyManager)
      .addListener(this._viewportManager)
      .addListener(this._tooltipManager)
      .addListener(this._notificationManager)
      .addListener(this._broadcastManager)
      .addListener(this);

    // TODO: This is only used to control transitions (do we really need it?)
    this._init = false;

    this.state = {
      hide: false,
    };

    this._mediaQuerySmallWidthList = window.matchMedia(
      'only screen and (max-width: 400px)'
    );
    this._mediaQuerySmallHeightList = window.matchMedia(
      'only screen and (min-height: 400px)'
    );

    // this._notificationManager.pushNotification("Welcome to Flap.js");
  }

  /**
   * Called once by index.js when the window is opened, before
   * this constructor or any React components are initialized. This also must be
   * static since React instances are not yet available.
   */
  static onWindowLoad() {
    Broadcast.initialize(BROADCAST_CHANNEL_ID);
  }

  /**
   * Called once by index.js when the window is closed. This is the alternative
   * for clean up since componentWillUnmount() from React will not be called for
   * window events. This also must be static since React instances are no longer
   * available.
   */
  static onWindowUnload() {
    if (App.INSTANCE) {
      App.INSTANCE.componentWillUnmount();
    }
  }

  //DuckType
  onSessionStart(session) {
    const currentModule = session.getCurrentModule();

    /*
    this._hotKeyManager
      .registerHotKey('New', [CTRL_KEY, 'KeyN'], () =>
        currentModule.clear(this)
      )
      .registerAltHotKey('Show Hints', () => {
        IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL;
      });
    */

    // Only register undo / redo hotkeys if undo is possible
    /*
    if (this._undoManager.getEventHandlerFactory()) {
      this._hotKeyManager
        .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () =>
          this.getUndoManager().undo()
        )
        .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () =>
          this.getUndoManager().redo()
        );
    }
    */

    if (!this._tooltipManager.hasTooltips()) {
      this._tooltipManager
        .addTooltip("If you need help, try the '?' at the top.")
        .addTooltip('Or you can choose to do nothing.')
        .addTooltip("I can't do anything about that.")
        .addTooltip(
          'You really should consider doing something though, for the sake of both of us.'
        )
        .addTooltip('Of course, it is your free will.')
        .addTooltip('You do you.')
        .addTooltip('Please do something.')
        .addTooltip('I need my job.')
        .addTooltip('Welcome to Flap.js!');
    }

    this._themeManager.setElement(document.getElementById('root'));

    registerAppStyles(this._themeManager);

    this._init = true;

    this._tutorialHandler.start(this);
  }

  //DuckType
  onSessionStop(session) {
    this._init = false;

    this._themeManager.clear();
    this._importManager.clear();
    this._exportManager.clear();
  }

  getToolbarComponent() {
    return this._toolbarComponent.current;
  }
  getDrawerComponent() {
    return this._drawerComponent.current;
  }

  getExportManager() {
    return this._exportManager;
  }
  getImportManager() {
    return this._importManager;
  }

  getHotKeyManager() {
    return this._hotKeyManager;
  }
  getViewportManager() {
    return this._viewportManager;
  }
  getTooltipManager() {
    return this._tooltipManager;
  }
  getNotificationManager() {
    return this._notificationManager;
  }
  getThemeManager() {
    return this._themeManager;
  }
  getBroadcastManager() {
    return this._broadcastManager;
  }
  getTutorialHandler() {
    return this._tutorialHandler;
  }

  getSession() {
    return this._session;
  }
  getCurrentModule() {
    return this._session.getCurrentModule();
  }
  getLocale() {
    return this._locale;
  }

  isExperimental() {
    return true;
  }

  /** @override */
  componentDidUpdate() {
    this._session.updateSession(this);

    const toolbarComponent = this._toolbarComponent.current;
    const drawerComponent = this._drawerComponent.current;
    //Disable hotkeys when graph is not in view
    this._hotKeyManager.setEnabled(
      !(toolbarComponent && toolbarComponent.isBarOpen()) &&
        !(
          drawerComponent &&
          drawerComponent.isDrawerOpen() &&
          drawerComponent.isDrawerFullscreen()
        )
    );
  }

  /** @override */
  render() {
    const session = this._session;
    const currentModule = session.getCurrentModule();

    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
    const isFullscreen = this.state.hide;

    const tooltipManager = this._tooltipManager;
    const notificationManager = this._notificationManager;;

    // HACK: Force self-update
    requestAnimationFrame(() => this.forceUpdate());

    return (
      <LocaleConsumer>
        {(locale) => {
          this._locale = locale;
          return (
            <div className={Style.app_container + (currentModule ? ' active ' : '')}>
              <AppBar
                app={this}
                module={currentModule}
                session={session}
                toolbarRef={this._toolbarComponent}
                drawerRef={this._drawerComponent}
                isFullscreen={isFullscreen}/>
              <DrawerView
                ref={this._drawerComponent}
                className={Style.app_content}
                panelProps={{ session }}
                side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
                direction={
                  hasSmallHeight
                    ? DRAWER_BAR_DIRECTION_VERTICAL
                    : DRAWER_BAR_DIRECTION_HORIZONTAL
                }
                hide={isFullscreen}>
                <UploadDropZone>
                  <div className="viewport">
                    <TooltipView
                      mode={tooltipManager.getTransitionMode()}
                      visible={
                        /* TODO: For the initial fade-in animation */ this._init
                        /* && !undoManager.canUndo() */
                      }>
                      {tooltipManager.getTooltips().map((e, i) => (
                        <label key={e + ':' + i}>{e}</label>
                      ))}
                    </TooltipView>

                    <Slot name="background" slottedProps={{ app: this, module: currentModule }} />
                    <Slot name="playground" slottedProps={{ app: this, module: currentModule }} />
                    <Slot name="foreground" slottedProps={{ app: this, module: currentModule }} />

                    <FullscreenWidget
                      className={Style.fullscreen_widget}
                      app={this}
                    />

                    <NotificationView notificationManager={notificationManager} />

                    {this._hotKeyManager.isEnabled() && (
                      <HotKeyView hotKeyManager={this._hotKeyManager} />
                    )}
                  </div>
                </UploadDropZone>
              </DrawerView>
            </div>
          );
        }}
      </LocaleConsumer>
    );
  }
}
App.INSTANCE = null;

//For hotloading this class
export default App;
