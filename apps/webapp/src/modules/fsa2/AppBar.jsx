import React from 'react';

import ToolbarButton from 'src/components/appbar/toolbar/ToolbarButton';
import ToolbarDivider from 'src/components/appbar/toolbar/ToolbarDivider';
import ToolbarUploadButton from 'src/components/appbar/toolbar/ToolbarUploadButton';
import PageEmptyIcon from 'src/assets/icons/page-empty.svg';
import UndoIcon from 'src/assets/icons/undo.svg';
import RedoIcon from 'src/assets/icons/redo.svg';
import UploadIcon from 'src/assets/icons/upload.svg';
import DownloadIcon from 'src/assets/icons/download.svg';
import HelpIcon from 'src/assets/icons/help.svg';

import { ERROR_LAYOUT_ID } from 'src/session/manager/notification/NotificationManager';
import { useLocale } from 'src/libs/i18n';

const HELP_URL =
  'https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md';

const MENU_INDEX_EXPORT = 0;

const ERROR_UPLOAD_NOTIFICATION_TAG = 'error_upload';

export function AppBar({ app, module, toolbarRef }) {
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
      toolbarRef.current.closeBar();
    }
  }

  return (
    <>
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.newmachine')}
        icon={PageEmptyIcon}
        onClick={onToolbarClearButton}
        disabled={!currentModule}
      />
      <ToolbarUploadButton
        title={locale.getLocaleString('action.toolbar.uploadmachine')}
        icon={UploadIcon}
        accept={importManager.getFileTypesAsAcceptString()}
        onUpload={onToolbarUploadButton}
        disabled={importManager.isEmpty()}
      />
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.undo')}
        icon={UndoIcon}
        disabled={!undoManager.canUndo()}
        onClick={() => undoManager.undo()}
      />
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.redo')}
        icon={RedoIcon}
        disabled={!undoManager.canRedo()}
        onClick={() => undoManager.redo()}
      />
      <ToolbarButton
        title={locale.getLocaleString('component.exporting.title')}
        icon={DownloadIcon}
        onClick={() => toolbarRef.current.setCurrentMenu(MENU_INDEX_EXPORT)}
        disabled={exportManager.isEmpty()}
      />
      <ToolbarDivider />
      <ToolbarButton
        title={locale.getLocaleString('action.toolbar.help')}
        icon={HelpIcon}
        onClick={() => window.open(HELP_URL, '_blank')}
      />
    </>
  );
}
