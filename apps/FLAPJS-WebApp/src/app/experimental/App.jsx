import React from 'react';
import { hot } from 'react-hot-loader/root';
import Style from './App.module.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from 'src/app/experimental/drawer/DrawerView';
import ToolbarView from 'src/app/experimental/toolbar/ToolbarView';
import TooltipView from 'src/app/experimental/tooltip/TooltipView';
import UploadDropZone from 'src/app/experimental/components/UploadDropZone';
import NotificationView from 'src/app/session/manager/notification/components/NotificationView';
import IconButton from 'src/app/experimental/components/IconButton';
import FullscreenWidget from 'src/app/experimental/components/FullscreenWidget';

import ExportPanel from 'src/app/experimental/menus/export/ExportPanel';
import OptionPanel from 'src/app/experimental/menus/option/OptionPanel';
import LanguagePanel from 'src/app/experimental/menus/language/LanguagePanel';
import ModuleLoaderPanel from 'src/app/experimental/menus/moduleloader/ModuleLoaderPanel';

import ToolbarButton, { TOOLBAR_CONTAINER_TOOLBAR, TOOLBAR_CONTAINER_MENU } from 'src/app/experimental/toolbar/ToolbarButton';
import ToolbarDivider from 'src/app/experimental/toolbar/ToolbarDivider';
import ToolbarUploadButton from 'src/app/experimental/toolbar/ToolbarUploadButton';
import PageEmptyIcon from 'src/app/components/iconset/PageEmptyIcon';
import UndoIcon from 'src/app/components/iconset/UndoIcon';
import RedoIcon from 'src/app/components/iconset/RedoIcon';
import UploadIcon from 'src/app/components/iconset/UploadIcon';
import DownloadIcon from 'src/app/components/iconset/DownloadIcon';
import BugIcon from 'src/app/components/iconset/BugIcon';
import WorldIcon from 'src/app/components/iconset/WorldIcon';
import HelpIcon from 'src/app/components/iconset/HelpIcon';
import SettingsIcon from 'src/app/components/iconset/SettingsIcon';
import EditPencilIcon from 'src/app/components/iconset/EditPencilIcon';

import AppSaver from 'src/app/experimental/AppSaver';
import ColorSaver from 'src/app/experimental/ColorSaver';
import * as ColorTransform from 'src/app/util/ColorTransform';
import LanguageSaver from 'src/app/experimental/LanguageSaver';

import AutoSave from 'src/app/util/storage/AutoSave';
import LocalStorage from 'src/app/util/storage/LocalStorage';

import ExportManager from 'src/app/util/file/export/ExportManager';
import ImportManager from 'src/app/util/file/import/ImportManager';

import Session from 'src/app/session/Session';
import DrawerManager from 'src/app/session/manager/DrawerManager';
import MenuManager from 'src/app/session/manager/MenuManager';
import ViewportManager from 'src/app/session/manager/ViewportManager';
import HotKeyManager, { CTRL_KEY, SHIFT_KEY } from 'src/app/session/manager/hotkey/HotKeyManager';
import HotKeyView from 'src/app/session/manager/hotkey/HotKeyView';
import UndoManager from 'src/app/session/manager/undo/UndoManager';
import RenderManager, {
    RENDER_LAYER_WORKSPACE_PRE,
    RENDER_LAYER_WORKSPACE,
    RENDER_LAYER_WORKSPACE_POST,
} from 'src/app/session/manager/RenderManager';
import TooltipManager from 'src/app/session/manager/TooltipManager';
import NotificationManager, { ERROR_LAYOUT_ID } from 'src/app/session/manager/notification/NotificationManager';
import ThemeManager from '../util/theme/ThemeManager';
import BroadcastManager from 'src/app/session/manager/broadcast/BroadcastManager';
import Broadcast from 'src/app/util/broadcast/Broadcast';

const BUGREPORT_URL = 'https://goo.gl/forms/XSil43Xl5xLHsa0E2';
const HELP_URL = 'https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md';

const DRAWER_INDEX_ABOUT = 0;

const MENU_INDEX_EXPORT = 0;
const MENU_INDEX_OPTION = 1;
const MENU_INDEX_LANGUAGE = 2;
const MENU_INDEX_MODULE = 3;

const ERROR_UPLOAD_NOTIFICATION_TAG = 'error_upload';

const BROADCAST_CHANNEL_ID = 'fla';

function registerAppStyles(themeManager)
{
    themeManager.register('--color-graph-node', 'graph');
    themeManager.register('--color-graph-text', 'graph');
    themeManager.register('--color-graph-select', 'graph');

    themeManager.register('--color-accent', 'general');
    const colorPrimary = themeManager.register('--color-primary', 'general');
    themeManager.register('--color-primary-text', 'general');
    themeManager.register('--color-primary-lite', 'hidden', colorPrimary, ColorTransform.lite);
    themeManager.register('--color-primary-dark', 'hidden', colorPrimary, ColorTransform.dark);

    const colorBackground = themeManager.register('--color-background', 'general');
    themeManager.register('--color-background-active', 'hidden', colorBackground, ColorTransform.invert);
    themeManager.register('--color-background-lite', 'hidden', colorBackground, ColorTransform.lite);

    themeManager.register('--color-success', 'general');
    themeManager.register('--color-warning', 'general');

    const colorSurface = themeManager.register('--color-surface', 'surface');
    themeManager.register('--color-surface-text', 'surface');
    themeManager.register('--color-surface-active', 'hidden', colorSurface, ColorTransform.invert);
    themeManager.register('--color-surface-lite', 'hidden', colorSurface, ColorTransform.lite);
    themeManager.register('--color-surface-dark', 'hidden', colorSurface, ColorTransform.dark);

    const colorSurfaceError = themeManager.register('--color-surface-error', 'surface');
    themeManager.register('--color-surface-error-dark', 'hidden', colorSurfaceError, ColorTransform.dark);

    const colorSurfaceSuccess = themeManager.register('--color-surface-success', 'surface');
    themeManager.register('--color-surface-success-dark', 'hidden', colorSurfaceSuccess, ColorTransform.dark);

    const colorSurfaceWarning = themeManager.register('--color-surface-warning', 'surface');
    themeManager.register('--color-surface-warning-dark', 'hidden', colorSurfaceWarning, ColorTransform.dark);
}

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        App.INSTANCE = this;

        this._toolbarComponent = React.createRef();
        this._drawerComponent = React.createRef();
        this._viewport = null;
        this._labeleditor = null;

        this._themeManager = new ThemeManager();
        this._colorSaver = new ColorSaver(this._themeManager);
        this._langSaver = new LanguageSaver();
        this._saver = new AppSaver(this);

        this._exportManager = new ExportManager();
        this._importManager = new ImportManager();

        this._undoManager = new UndoManager();
        this._hotKeyManager = new HotKeyManager();
        this._drawerManager = new DrawerManager();
        this._menuManager = new MenuManager();
        this._viewportManager = new ViewportManager();
        this._renderManager = new RenderManager();
        this._tooltipManager = new TooltipManager();
        this._notificationManager = new NotificationManager();
        this._broadcastManager = new BroadcastManager(this);

        this._session = new Session()
            .addListener(this._undoManager)
            .addListener(this._hotKeyManager)
            .addListener(this._drawerManager)
            .addListener(this._menuManager)
            .addListener(this._viewportManager)
            .addListener(this._renderManager)
            .addListener(this._tooltipManager)
            .addListener(this._notificationManager)
            .addListener(this._broadcastManager)
            .addListener(this);

        // TODO: This is only used to control transitions (do we really need it?)
        this._init = false;

        this.state = {
            hide: false
        };

        this._mediaQuerySmallWidthList = window.matchMedia('only screen and (max-width: 400px)');
        this._mediaQuerySmallHeightList = window.matchMedia('only screen and (min-height: 400px)');

        // this._notificationManager.pushNotification("Welcome to Flap.js");
        this.onModuleTitleClick = this.onModuleTitleClick.bind(this);
        this.onToolbarClearButton = this.onToolbarClearButton.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        //Start session
        this._session.startSession(this);
    }

    /** @override */
    componentWillUnmount()
    {
        //Stop session
        this._session.stopSession(this);
    }

    /**
     * Called once by index.js when the window is opened, before
     * this constructor or any React components are initialized. This also must be
     * static since React instances are not yet available.
     */
    static onWindowLoad()
    {
        AutoSave.initialize(LocalStorage);
        Broadcast.initialize(BROADCAST_CHANNEL_ID);
    }

    /**
     * Called once by index.js when the window is closed. This is the alternative
     * for clean up since componentWillUnmount() from React will not be called for
     * window events. This also must be static since React instances are no longer
     * available.
     */
    static onWindowUnload()
    {
        AutoSave.destroy();

        if (App.INSTANCE)
        {
            App.INSTANCE.componentWillUnmount();
        }
    }

    //DuckType
    onSessionStart(session)
    {
        const currentModule = session.getCurrentModule();

        // Default values
        this._menuManager
            .addPanelClass(ExportPanel)         // MENU_INDEX_EXPORT
            .addPanelClass(OptionPanel)         // MENU_INDEX_OPTION
            .addPanelClass(LanguagePanel)       // MENU_INDEX_LANGUAGE
            .addPanelClass(ModuleLoaderPanel);  // MENU_INDEX_MODULE

        this._hotKeyManager
            .registerHotKey('New', [CTRL_KEY, 'KeyN'], () => currentModule.clear(this))
            .registerAltHotKey('Show Hints', () => { IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL; });

        // Only register undo / redo hotkeys if undo is possible
        if (this._undoManager.getEventHandlerFactory())
        {
            this._hotKeyManager
                .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () => this.getUndoManager().undo())
                .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => this.getUndoManager().redo());
        }

        if (!this._tooltipManager.hasTooltips())
        {
            this._tooltipManager
                .addTooltip('If you need help, try the \'?\' at the top.')
                .addTooltip('Or you can choose to do nothing.')
                .addTooltip('I can\'t do anything about that.')
                .addTooltip('You really should consider doing something though, for the sake of both of us.')
                .addTooltip('Of course, it is your free will.')
                .addTooltip('You do you.')
                .addTooltip('Please do something.')
                .addTooltip('I need my job.')
                .addTooltip('Welcome to Flap.js!');
        }

        this._themeManager.setElement(document.getElementById('root'));

        registerAppStyles(this._themeManager);

        AutoSave.registerHandler(this._saver);
        AutoSave.registerHandler(this._colorSaver);
        AutoSave.registerHandler(this._langSaver);

        this._init = true;
    }

    //DuckType
    onSessionStop(session)
    {
        this._init = false;

        AutoSave.unregisterHandler(this._saver);
        AutoSave.unregisterHandler(this._colorSaver);
        AutoSave.unregisterHandler(this._langSaver);

        this._themeManager.clear();
        this._importManager.clear();
        this._exportManager.clear();
        this._menuManager.setSubtitleComponentClass(null);
    }

    onModuleTitleClick(e)
    {
        const drawer = this._drawerComponent.current;
        if (!drawer.isDrawerOpen() || !drawer.isCurrentTab(DRAWER_INDEX_ABOUT))
        {
            //Open current module info panel
            drawer.setCurrentTab(DRAWER_INDEX_ABOUT);
        }
        else
        {
            //On another click... open module change panel
            const toolbarComponent = this._toolbarComponent.current;
            toolbarComponent.setCurrentMenu(MENU_INDEX_MODULE);
        }

        e.preventDefault();
        e.stopPropagation();
    }

    onToolbarClearButton(e)
    {
        const currentModule = this._session.getCurrentModule();
        if (currentModule)
        {
            currentModule.clear(this);
        }
    }

    getToolbarComponent() { return this._toolbarComponent.current; }
    getDrawerComponent() { return this._drawerComponent.current; }

    getExportManager() { return this._exportManager; }
    getImportManager() { return this._importManager; }

    getUndoManager() { return this._undoManager; }
    getHotKeyManager() { return this._hotKeyManager; }
    getDrawerManager() { return this._drawerManager; }
    getMenuManager() { return this._menuManager; }
    getViewportManager() { return this._viewportManager; }
    getRenderManager() { return this._renderManager; }
    getTooltipManager() { return this._tooltipManager; }
    getNotificationManager() { return this._notificationManager; }
    getThemeManager() { return this._themeManager; }
    getBroadcastManager() { return this._broadcastManager; }

    getSession() { return this._session; }
    getCurrentModule() { return this._session.getCurrentModule(); }

    isExperimental() { return true; }

    /** @override */
    componentDidUpdate()
    {
        this._session.updateSession(this);

        const toolbarComponent = this._toolbarComponent.current;
        const drawerComponent = this._drawerComponent.current;
        //Disable hotkeys when graph is not in view
        this._hotKeyManager.setEnabled(
            !(toolbarComponent && toolbarComponent.isBarOpen()) &&
            !(drawerComponent && drawerComponent.isDrawerOpen() &&
                drawerComponent.isDrawerFullscreen())
        );
    }

    renderRenderLayer(renderLayerName, props)
    {
        const sessionID = this._session.getSessionID();
        const renderers = this._renderManager.getRenderersByLayer(renderLayerName);
        if (renderers && renderers.length > 0)
        {
            return renderers.map((R, i) => <R key={sessionID + '.' + R.constructor.name + '.' + i} {...props} />);
        }
        else
        {
            return null;
        }
    }

    /** @override */
    render()
    {
        const session = this._session;
        const currentModule = session.getCurrentModule();
        const currentModuleLocalizedName = currentModule ? currentModule.getLocalizedModuleName() : null;

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
        const drawerPanelProps = drawerManager.getPanelProps() || { session: session };
        const menuPanelClasses = menuManager.getPanelClasses();
        const menuPanelProps = menuManager.getPanelProps() || { session: session };
        const MenuSubtitleClass = menuManager.getSubtitleComponentClass();

        return (
            <div className={Style.app_container + (currentModule ? ' active ' : '')}>
                <ToolbarView ref={this._toolbarComponent} className={Style.app_bar}
                    menus={menuPanelClasses}
                    menuProps={menuPanelProps}
                    subtitle={MenuSubtitleClass}
                    hide={isFullscreen}
                    title={currentModuleLocalizedName}
                    session={session}
                    onTitleClick={this.onModuleTitleClick}>
                    <ToolbarButton title={I18N.toString('action.toolbar.newmachine')}
                        icon={PageEmptyIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        onClick={this.onToolbarClearButton}
                        disabled={!currentModule} />
                    <ToolbarUploadButton
                        title={I18N.toString('action.toolbar.uploadmachine')}
                        icon={UploadIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        accept={importManager.getFileTypesAsAcceptString()}
                        onUpload={fileBlob => 
                        {
                            importManager.tryImportFile(fileBlob)
                                .catch(e =>
                                    notificationManager.pushNotification(
                                        'ERROR: Unable to import invalid file.\n' + e.message,
                                        ERROR_LAYOUT_ID,
                                        ERROR_UPLOAD_NOTIFICATION_TAG))
                                .finally(() =>
                                    toolbarComponent.closeBar());
                        }}
                        disabled={importManager.isEmpty()} />
                    <ToolbarButton title={I18N.toString('action.toolbar.undo')}
                        icon={UndoIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        disabled={!undoManager.canUndo()}
                        onClick={() => undoManager.undo()} />
                    <ToolbarButton title={I18N.toString('action.toolbar.redo')}
                        icon={RedoIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        disabled={!undoManager.canRedo()}
                        onClick={() => undoManager.redo()} />
                    <ToolbarButton title={I18N.toString('component.exporting.title')}
                        icon={DownloadIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_EXPORT)}
                        disabled={exportManager.isEmpty()} />
                    <ToolbarDivider />
                    <ToolbarButton title={I18N.toString('action.toolbar.changemodule')}
                        icon={EditPencilIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_MODULE)} />
                    <ToolbarButton title={I18N.toString('action.toolbar.lang')}
                        icon={WorldIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_LANGUAGE)} />
                    <ToolbarButton title={I18N.toString('component.options.title')}
                        icon={SettingsIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_OPTION)} />
                    <ToolbarButton title={I18N.toString('action.toolbar.help')}
                        icon={HelpIcon}
                        onClick={() => window.open(HELP_URL, '_blank')} />
                    <ToolbarButton title={I18N.toString('action.toolbar.bug')}
                        icon={BugIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => window.open(BUGREPORT_URL, '_blank')} />
                </ToolbarView>

                <DrawerView ref={this._drawerComponent} className={Style.app_content}
                    panels={drawerPanelClasses}
                    panelProps={drawerPanelProps}
                    side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
                    direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}
                    hide={isFullscreen}>

                    <UploadDropZone>
                        <div className="viewport">
                            <TooltipView mode={tooltipManager.getTransitionMode()}
                                visible={/* TODO: For the initial fade-in animation */this._init && !undoManager.canUndo()}>
                                {tooltipManager.getTooltips().map((e, i) => <label key={e + ':' + i}>{e}</label>)}
                            </TooltipView>

                            {/* RENDER_LAYER_WORKSPACE_PRE */}
                            {this.renderRenderLayer(RENDER_LAYER_WORKSPACE_PRE)}

                            {/* RENDER_LAYER_WORKSPACE */}
                            {this.renderRenderLayer(RENDER_LAYER_WORKSPACE)}

                            {/* RENDER_LAYER_WORKSPACE_POST */}
                            {this.renderRenderLayer(RENDER_LAYER_WORKSPACE_POST)}

                            <FullscreenWidget className={Style.fullscreen_widget} app={this} />

                            <NotificationView notificationManager={notificationManager} />

                            {this._hotKeyManager.isEnabled() && <HotKeyView hotKeyManager={this._hotKeyManager} />}
                        </div>
                    </UploadDropZone>
                </DrawerView>
            </div>
        );
    }
}
App.INSTANCE = null;

//For hotloading this class
export default hot(App);
