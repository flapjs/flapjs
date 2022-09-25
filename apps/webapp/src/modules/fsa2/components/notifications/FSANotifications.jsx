import NFAToDFAConversionNotificationLayout from './NFAToDFAConversionNotificationLayout';
export const MACHINE_CONVERSION_LAYOUT_ID = 'machine-convert';
export const MACHINE_CONVERSION_NOTIFICATION_TAG = 'machine-convert';

import StateNotificationLayout from './StateNotificationLayout';
export const STATE_LAYOUT_ID = 'machine-state';

import TransitionNotificationLayout from './TransitionNotificationLayout';
export const TRANSITION_LAYOUT_ID = 'machine-transition';

import StateMissingTransitionNotificationLayout from './StateMissingTransitionNotificationLayout';
export const STATE_MISSING_LAYOUT_ID = 'machine-state-missing';

import StateUnreachableNotificationLayout from './StateUnreachableNotificationLayout';
export const STATE_UNREACHABLE_LAYOUT_ID = 'machine-state-unreachable';

export const MACHINE_ERROR_NOTIFICATION_TAG = 'machine-error';

export function registerNotifications(notificationManager) {
  notificationManager.registerNotificationLayout(
    MACHINE_CONVERSION_LAYOUT_ID,
    NFAToDFAConversionNotificationLayout
  );
  notificationManager.registerNotificationLayout(
    STATE_MISSING_LAYOUT_ID,
    StateMissingTransitionNotificationLayout
  );
  notificationManager.registerNotificationLayout(
    STATE_UNREACHABLE_LAYOUT_ID,
    StateUnreachableNotificationLayout
  );
  notificationManager.registerNotificationLayout(
    STATE_LAYOUT_ID,
    StateNotificationLayout
  );
  notificationManager.registerNotificationLayout(
    TRANSITION_LAYOUT_ID,
    TransitionNotificationLayout
  );
}
