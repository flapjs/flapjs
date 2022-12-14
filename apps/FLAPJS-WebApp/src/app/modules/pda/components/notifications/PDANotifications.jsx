import StateNotificationLayout from './StateNotificationLayout';
export const STATE_LAYOUT_ID = 'machine-state';

import TransitionNotificationLayout from './TransitionNotificationLayout';
export const TRANSITION_LAYOUT_ID = 'machine-transition';

import StateUnreachableNotificationLayout from './StateUnreachableNotificationLayout';
export const STATE_UNREACHABLE_LAYOUT_ID = 'machine-state-unreachable';

export const MACHINE_ERROR_NOTIFICATION_TAG = 'machine-error';

export function registerNotifications(notificationManager)
{
    notificationManager.registerNotificationLayout(STATE_UNREACHABLE_LAYOUT_ID, StateUnreachableNotificationLayout);
    notificationManager.registerNotificationLayout(STATE_LAYOUT_ID, StateNotificationLayout);
    notificationManager.registerNotificationLayout(TRANSITION_LAYOUT_ID, TransitionNotificationLayout);
}
