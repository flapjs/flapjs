import React from 'react';
import Style from 'src/components/App.module.css';
import { Slot } from 'src/libs/slot';
import ToolbarView from './toolbar/ToolbarView';
import { MENU_INDEX_MODULE } from 'src/modules/fsa2/MenuBar';

const DRAWER_INDEX_ABOUT = 0;

export function AppBar({ app, module, session, toolbarRef, drawerRef, isFullscreen }) {
    const currentModuleLocalizedName = module
      ? module.getLocalizedModuleName()
      : null;
    
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
            menuProps={{ session }}
            hide={isFullscreen}
            title={currentModuleLocalizedName}
            session={session}
            onTitleClick={onModuleTitleClick}
            renderMenu={() => (
                <Slot name="menubar" slottedProps={{ app, module, toolbarRef }} />
            )}
            renderBar={() => (
                <Slot name="appbar" slottedProps={{ app, module, toolbarRef }} />
            )}
            renderSubtitle={() => (
                <Slot name="appbar.subtitle" slottedProps={{ app, module, toolbarRef }}/>
            )}/>
    )
}
