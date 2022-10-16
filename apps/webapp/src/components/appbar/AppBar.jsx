import React from 'react';
import { useRef } from 'react';
import Style from 'src/components/App.module.css';
import { Slot } from 'src/libs/slot';
import ToolbarView from './toolbar/ToolbarView';

const DRAWER_INDEX_ABOUT = 0;
const MENU_INDEX_MODULE = 3;

export function AppBar({ app, module, session, toolbarRef, drawerRef, isFullscreen }) {
    const currentModuleLocalizedName = module
      ? module.getLocalizedModuleName()
      : null;

    const menuManager = app.getMenuManager();
    const menuPanelClasses = menuManager.getPanelClasses();
    const menuPanelProps = menuManager.getPanelProps() || { session };
    const MenuSubtitleClass = menuManager.getSubtitleComponentClass();

    function onModuleTitleClick(e) {
        const drawer = drawerRef.current;
        if (!drawer.isDrawerOpen() || !drawer.isCurrentTab(DRAWER_INDEX_ABOUT)) {
            //Open current module info panel
            drawer.setCurrentTab(DRAWER_INDEX_ABOUT);
        } else {
            //On another click... open module change panel
            const toolbarComponent = toolbarRef.current;
            toolbarComponent.setCurrentMenu(MENU_INDEX_MODULE);
        }
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <ToolbarView
            ref={toolbarRef}
            className={Style.app_bar}
            menus={menuPanelClasses}
            menuProps={menuPanelProps}
            subtitle={MenuSubtitleClass}
            hide={isFullscreen}
            title={currentModuleLocalizedName}
            session={session}
            onTitleClick={onModuleTitleClick}
            renderMenu={() => (
                <Slot name="menubar" app={app} module={module} toolbarRef={toolbarRef}/>
            )}
            renderBar={() => (
                <Slot name="appbar" app={app} module={module} toolbarRef={toolbarRef}/>
            )}/>
    )
}
