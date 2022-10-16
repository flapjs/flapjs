import React from 'react';
import Style from './App.module.css';

import DrawerView, {
  DRAWER_SIDE_RIGHT,
  DRAWER_SIDE_BOTTOM,
  DRAWER_BAR_DIRECTION_VERTICAL,
  DRAWER_BAR_DIRECTION_HORIZONTAL,
} from 'src/components/drawer/DrawerView';
import ToolbarView from 'src/components/toolbar/ToolbarView';
import TooltipView from 'src/components/tooltip/TooltipView';
import UploadDropZone from 'src/components/UploadDropZone';
import NotificationView from 'src/session/manager/notification/components/NotificationView';
import IconButton from 'src/components/IconButton';
import FullscreenWidget from 'src/components/FullscreenWidget';

import ExportPanel from 'src/components/menus/export/ExportPanel';
import OptionPanel from 'src/components/menus/option/OptionPanel';
import LanguagePanel from 'src/components/menus/language/LanguagePanel';
import ModuleLoaderPanel from 'src/components/menus/moduleloader/ModuleLoaderPanel';

import ToolbarButton, {
  TOOLBAR_CONTAINER_TOOLBAR,
  TOOLBAR_CONTAINER_MENU,
} from 'src/components/toolbar/ToolbarButton';
import ToolbarDivider from 'src/components/toolbar/ToolbarDivider';
import ToolbarUploadButton from 'src/components/toolbar/ToolbarUploadButton';
import PageEmptyIcon from 'src/assets/icons/page-empty.svg';
import UndoIcon from 'src/assets/icons/undo.svg';
import RedoIcon from 'src/assets/icons/redo.svg';
import UploadIcon from 'src/assets/icons/upload.svg';
import DownloadIcon from 'src/assets/icons/download.svg';
import BugIcon from 'src/assets/icons/bug.svg';
import WorldIcon from 'src/assets/icons/world.svg';
import HelpIcon from 'src/assets/icons/help.svg';
import SettingsIcon from 'src/assets/icons/settings.svg';
import EditPencilIcon from 'src/assets/icons/pencil.svg';

import * as ColorTransform from 'src/util/ColorTransform';

import ExportManager from 'src/util/file/export/ExportManager';
import ImportManager from 'src/util/file/import/ImportManager';

import DrawerManager from 'src/session/manager/DrawerManager';
import MenuManager from 'src/session/manager/MenuManager';
import ViewportManager from 'src/session/manager/ViewportManager';
import HotKeyManager, {
  CTRL_KEY,
  SHIFT_KEY,
} from 'src/session/manager/hotkey/HotKeyManager';
import HotKeyView from 'src/session/manager/hotkey/HotKeyView';
import UndoManager from 'src/session/manager/undo/UndoManager';
import TooltipManager from 'src/session/manager/TooltipManager';
import NotificationManager, {
  ERROR_LAYOUT_ID,
} from 'src/session/manager/notification/NotificationManager';
import ThemeManager from 'src/util/theme/ThemeManager';
import BroadcastManager from 'src/session/manager/broadcast/BroadcastManager';
import Broadcast from 'src/util/broadcast/Broadcast';
import { Slot } from 'src/libs/slot/Slot';
import { LocaleConsumer } from 'src/libs/i18n';

const BUGREPORT_URL = 'https://goo.gl/forms/XSil43Xl5xLHsa0E2';
const HELP_URL =
  'https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md';

const DRAWER_INDEX_ABOUT = 0;

const MENU_INDEX_EXPORT = 0;
const MENU_INDEX_OPTION = 1;
const MENU_INDEX_LANGUAGE = 2;
const MENU_INDEX_MODULE = 3;

const ERROR_UPLOAD_NOTIFICATION_TAG = 'error_upload';

const BROADCAST_CHANNEL_ID = 'fla';

function registerAppStyles(themeManager) {
  themeManager.register('--color-graph-node', 'graph');
  themeManager.register('--color-graph-text', 'graph');
  themeManager.register('--color-graph-select', 'graph');

  themeManager.register('--color-accent', 'general');
  const colorPrimary = themeManager.register('--color-primary', 'general');
  themeManager.register('--color-primary-text', 'general');
  themeManager.register(
    '--color-primary-lite',
    'hidden',
    colorPrimary,
    ColorTransform.lite
  );
  themeManager.register(
    '--color-primary-dark',
    'hidden',
    colorPrimary,
    ColorTransform.dark
  );

  const colorBackground = themeManager.register(
    '--color-background',
    'general'
  );
  themeManager.register(
    '--color-background-active',
    'hidden',
    colorBackground,
    ColorTransform.invert
  );
  themeManager.register(
    '--color-background-lite',
    'hidden',
    colorBackground,
    ColorTransform.lite
  );

  themeManager.register('--color-success', 'general');
  themeManager.register('--color-warning', 'general');

  const colorSurface = themeManager.register('--color-surface', 'surface');
  themeManager.register('--color-surface-text', 'surface');
  themeManager.register(
    '--color-surface-active',
    'hidden',
    colorSurface,
    ColorTransform.invert
  );
  themeManager.register(
    '--color-surface-lite',
    'hidden',
    colorSurface,
    ColorTransform.lite
  );
  themeManager.register(
    '--color-surface-dark',
    'hidden',
    colorSurface,
    ColorTransform.dark
  );

  const colorSurfaceError = themeManager.register(
    '--color-surface-error',
    'surface'
  );
  themeManager.register(
    '--color-surface-error-dark',
    'hidden',
    colorSurfaceError,
    ColorTransform.dark
  );

  const colorSurfaceSuccess = themeManager.register(
    '--color-surface-success',
    'surface'
  );
  themeManager.register(
    '--color-surface-success-dark',
    'hidden',
    colorSurfaceSuccess,
    ColorTransform.dark
  );

  const colorSurfaceWarning = themeManager.register(
    '--color-surface-warning',
    'surface'
  );
  themeManager.register(
    '--color-surface-warning-dark',
    'hidden',
    colorSurfaceWarning,
    ColorTransform.dark
  );
}

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

    this._undoManager = new UndoManager();
    this._hotKeyManager = new HotKeyManager();
    this._drawerManager = new DrawerManager();
    this._menuManager = new MenuManager();
    this._viewportManager = new ViewportManager();
    this._tooltipManager = new TooltipManager();
    this._notificationManager = new NotificationManager();
    this._broadcastManager = new BroadcastManager(this);

    this._session = props.session
      .addListener(this._undoManager)
      .addListener(this._hotKeyManager)
      .addListener(this._drawerManager)
      .addListener(this._menuManager)
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
    this.onModuleTitleClick = this.onModuleTitleClick.bind(this);
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
    console.log('SESSION START');
    const currentModule = session.getCurrentModule();

    // Default values
    this._menuManager
      .addPanelClass(ExportPanel) // MENU_INDEX_EXPORT
      .addPanelClass(OptionPanel) // MENU_INDEX_OPTION
      .addPanelClass(LanguagePanel) // MENU_INDEX_LANGUAGE
      .addPanelClass(ModuleLoaderPanel); // MENU_INDEX_MODULE

    this._hotKeyManager
      .registerHotKey('New', [CTRL_KEY, 'KeyN'], () =>
        currentModule.clear(this)
      )
      .registerAltHotKey('Show Hints', () => {
        IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL;
      });

    // Only register undo / redo hotkeys if undo is possible
    if (this._undoManager.getEventHandlerFactory()) {
      this._hotKeyManager
        .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () =>
          this.getUndoManager().undo()
        )
        .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () =>
          this.getUndoManager().redo()
        );
    }

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
  }

  //DuckType
  onSessionStop(session) {
    console.log('SESSION STOP');
    this._init = false;

    this._themeManager.clear();
    this._importManager.clear();
    this._exportManager.clear();
    this._menuManager.setSubtitleComponentClass(null);
  }

  onModuleTitleClick(e) {
    const drawer = this._drawerComponent.current;
    if (!drawer.isDrawerOpen() || !drawer.isCurrentTab(DRAWER_INDEX_ABOUT)) {
      //Open current module info panel
      drawer.setCurrentTab(DRAWER_INDEX_ABOUT);
    } else {
      //On another click... open module change panel
      const toolbarComponent = this._toolbarComponent.current;
      toolbarComponent.setCurrentMenu(MENU_INDEX_MODULE);
    }

    e.preventDefault();
    e.stopPropagation();
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

  getUndoManager() {
    return this._undoManager;
  }
  getHotKeyManager() {
    return this._hotKeyManager;
  }
  getDrawerManager() {
    return this._drawerManager;
  }
  getMenuManager() {
    return this._menuManager;
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
    const currentModuleLocalizedName = currentModule
      ? currentModule.getLocalizedModuleName()
      : null;

    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
    const isFullscreen = this.state.hide;

    const exportManager = this._exportManager;
    const importManager = this._importManager;

    const undoManager = this._undoManager;
    const drawerManager = this._drawerManager;
    const menuManager = this._menuManager;
    const tooltipManager = this._tooltipManager;
    const notificationManager = this._notificationManager;

    const toolbarComponent = this._toolbarComponent.current;

    const drawerPanelClasses = drawerManager.getPanelClasses();
    const drawerPanelProps = drawerManager.getPanelProps() || {
      session: session,
    };
    const menuPanelClasses = menuManager.getPanelClasses();
    const menuPanelProps = menuManager.getPanelProps() || { session: session };
    const MenuSubtitleClass = menuManager.getSubtitleComponentClass();

    // HACK: Force self-update
    requestAnimationFrame(() => this.forceUpdate());

    return (
      <LocaleConsumer>
        {(locale) => {
          this._locale = locale;
          return (
            <div className={Style.app_container + (currentModule ? ' active ' : '')}>
              <ToolbarView
                ref={this._toolbarComponent}
                className={Style.app_bar}
                menus={menuPanelClasses}
                menuProps={menuPanelProps}
                subtitle={MenuSubtitleClass}
                hide={isFullscreen}
                title={currentModuleLocalizedName}
                session={session}
                onTitleClick={this.onModuleTitleClick}>
                <Slot name="appbar" app={this} module={currentModule} toolbar={toolbarComponent}/>
              </ToolbarView>

              <DrawerView
                ref={this._drawerComponent}
                className={Style.app_content}
                panels={drawerPanelClasses}
                panelProps={drawerPanelProps}
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
                        /* TODO: For the initial fade-in animation */ this._init &&
                        !undoManager.canUndo()
                      }>
                      {tooltipManager.getTooltips().map((e, i) => (
                        <label key={e + ':' + i}>{e}</label>
                      ))}
                    </TooltipView>

                    <Slot name="background" app={this} module={currentModule}/>
                    <Slot name="playground" app={this} module={currentModule}/>
                    <Slot name="foreground" app={this} module={currentModule}/>

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
