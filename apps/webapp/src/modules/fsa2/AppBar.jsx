import React from 'react';

import ToolbarButton, {
    TOOLBAR_CONTAINER_TOOLBAR,
    TOOLBAR_CONTAINER_MENU,
} from 'src/components/toolbar/ToolbarButton';
import ToolbarDivider from 'src/components/toolbar/ToolbarDivider';
import ToolbarUploadButton from 'src/components/toolbar/ToolbarUploadButton';
import PageEmptyIcon from 'src/assets/icons/page-empty.svg';
import UploadIcon from 'src/assets/icons/upload.svg';
import DownloadIcon from 'src/assets/icons/download.svg';
import BugIcon from 'src/assets/icons/bug.svg';
import WorldIcon from 'src/assets/icons/world.svg';
import HelpIcon from 'src/assets/icons/help.svg';
import SettingsIcon from 'src/assets/icons/settings.svg';
import EditPencilIcon from 'src/assets/icons/pencil.svg';

import UndoIcon from 'src/assets/icons/undo.svg';
import RedoIcon from 'src/assets/icons/redo.svg';

import { ERROR_LAYOUT_ID } from 'src/session/manager/notification/NotificationManager';
import { useLocale } from 'src/libs/i18n';

const BUGREPORT_URL = 'https://goo.gl/forms/XSil43Xl5xLHsa0E2';
const HELP_URL =
  'https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md';

const MENU_INDEX_EXPORT = 0;
const MENU_INDEX_OPTION = 1;
const MENU_INDEX_LANGUAGE = 2;
const MENU_INDEX_MODULE = 3;

const ERROR_UPLOAD_NOTIFICATION_TAG = 'error_upload';
  
export function AppBar({ app, module, toolbar }) {
    const locale = useLocale();
    const currentModule = module;
    const importManager = app.getImportManager();
    const exportManager = app.getExportManager();
    const notificationManager = app.getNotificationManager();
    const undoManager = app.getUndoManager();

    function onToolbarClearButton() {
        if (currentModule) {
          currentModule.clear(app);
        }
    }

    async function onToolbarUploadButton(fileBlob) {
        try {
            await importManager.tryImportFile(fileBlob);
        } catch (e) {
            notificationManager.pushNotification(
              'ERROR: Unable to import invalid file.\n' + e.message,
              ERROR_LAYOUT_ID,
              ERROR_UPLOAD_NOTIFICATION_TAG);
        } finally {
            toolbar.closeBar();
        }
    }

    return (
        <>
        <ToolbarButton
          title={locale.getLocaleString('action.toolbar.newmachine')}
          icon={PageEmptyIcon}
          containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
          onClick={onToolbarClearButton}
          disabled={!currentModule}
        />
        <ToolbarUploadButton
          title={locale.getLocaleString('action.toolbar.uploadmachine')}
          icon={UploadIcon}
          containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
          accept={importManager.getFileTypesAsAcceptString()}
          onUpload={onToolbarUploadButton}
          disabled={importManager.isEmpty()}
        />
        <ToolbarButton
          title={locale.getLocaleString('action.toolbar.undo')}
          icon={UndoIcon}
          containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
          disabled={!undoManager.canUndo()}
          onClick={() => undoManager.undo()}
        />
        <ToolbarButton
          title={locale.getLocaleString('action.toolbar.redo')}
          icon={RedoIcon}
          containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
          disabled={!undoManager.canRedo()}
          onClick={() => undoManager.redo()}
        />
        <ToolbarButton
          title={locale.getLocaleString('component.exporting.title')}
          icon={DownloadIcon}
          containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
          onClick={() => toolbar.setCurrentMenu(MENU_INDEX_EXPORT)}
          disabled={exportManager.isEmpty()}
        />
        <ToolbarDivider />
        <ToolbarButton
          title={locale.getLocaleString('action.toolbar.changemodule')}
          icon={EditPencilIcon}
          containerOnly={TOOLBAR_CONTAINER_MENU}
          onClick={() => toolbar.setCurrentMenu(MENU_INDEX_MODULE)}
        />
        <ToolbarButton
          title={locale.getLocaleString('action.toolbar.lang')}
          icon={WorldIcon}
          containerOnly={TOOLBAR_CONTAINER_MENU}
          onClick={() => toolbar.setCurrentMenu(MENU_INDEX_LANGUAGE)}
        />
        <ToolbarButton
          title={locale.getLocaleString('component.options.title')}
          icon={SettingsIcon}
          containerOnly={TOOLBAR_CONTAINER_MENU}
          onClick={() => toolbar.setCurrentMenu(MENU_INDEX_OPTION)}
        />
        <ToolbarButton
          title={locale.getLocaleString('action.toolbar.help')}
          icon={HelpIcon}
          onClick={() => window.open(HELP_URL, '_blank')}
        />
        <ToolbarButton
          title={locale.getLocaleString('action.toolbar.bug')}
          icon={BugIcon}
          containerOnly={TOOLBAR_CONTAINER_MENU}
          onClick={() => window.open(BUGREPORT_URL, '_blank')}
        />
        </>
    );
}
