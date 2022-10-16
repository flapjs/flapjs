import React from 'react';

import ToolbarButton from 'src/components/appbar/toolbar/ToolbarButton';
import BugIcon from 'src/assets/icons/bug.svg';
import WorldIcon from 'src/assets/icons/world.svg';
import HelpIcon from 'src/assets/icons/help.svg';
import SettingsIcon from 'src/assets/icons/settings.svg';
import EditPencilIcon from 'src/assets/icons/pencil.svg';

import { useLocale } from 'src/libs/i18n';

const BUGREPORT_URL = 'https://goo.gl/forms/XSil43Xl5xLHsa0E2';
const HELP_URL =
  'https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md';

const MENU_INDEX_OPTION = 1;
const MENU_INDEX_LANGUAGE = 2;
const MENU_INDEX_MODULE = 3;

export function MenuBar({ app, module, toolbarRef }) {
  const locale = useLocale();
  return (
    <>
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.changemodule')}
        icon={EditPencilIcon}
        onClick={() => toolbarRef.current.setCurrentMenu(MENU_INDEX_MODULE)}
      />
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.lang')}
        icon={WorldIcon}
        onClick={() => toolbarRef.current.setCurrentMenu(MENU_INDEX_LANGUAGE)}
      />
      <ToolbarButton
        title={locale.getLocaleString('component.options.title')}
        icon={SettingsIcon}
        onClick={() => toolbarRef.current.setCurrentMenu(MENU_INDEX_OPTION)}
      />
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.help')}
        icon={HelpIcon}
        onClick={() => window.open(HELP_URL, '_blank')}
      />
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.bug')}
        icon={BugIcon}
        onClick={() => window.open(BUGREPORT_URL, '_blank')}
      />
    </>
  );
}
