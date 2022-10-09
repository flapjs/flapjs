import React, { useState, useEffect } from 'react';
import { DIRTY_KEY, updateDirty, refresh, createSlotted, createSlotManager, getSlotManager, clearAll, contains, inject, reject, clear } from './SlotHelpers';

export const SlotContext = React.createContext(null);
const SlotProviderNameContext = React.createContext(null);

/**
 * @param {object} props 
 * @param {string} props.name
 * @param {React.ReactNode} [props.children]
 */
export function SlotProvider({ name, children }) {
  useEffect(() => {
    return () => {
      let slotManager = getSlotManager(name);
      if (!slotManager) return;
      // Clean-up time!

      // NOTE: We clean up here instead of in SlotContextProvider because that
      // context could re-render due to state change. However, this component
      // only handles the "name" of the provider. Which, if it changes, could
      // be assumed as a delete or clear (because all provider names are assumed
      // globally unique and are tied to that state).
      slotManager[DIRTY_KEY] = true;
      slotManager.slots = {};
    };
  });
  return (
    <SlotProviderNameContext.Provider value={name}>
      <SlotContextProvider providerName={name}>
        {children}
      </SlotContextProvider>
    </SlotProviderNameContext.Provider>
  );
}
SlotProvider.inject = inject;
SlotProvider.reject = reject;
SlotProvider.clear = clear;
SlotProvider.clearAll = clearAll;
SlotProvider.contains = contains;
SlotProvider.refresh = refresh;
SlotProvider.createSlotted = createSlotted;

function SlotContextProvider(props) {
  const { providerName } = props;

  let slotManager = createSlotManager(providerName);
  const [state, setState] = useState(slotManager);

  useEffect(() => {
    let animationFrameHandle = requestAnimationFrame(onAnimationFrame);
    function onAnimationFrame(now) {
      animationFrameHandle = requestAnimationFrame(onAnimationFrame);
      let slotManager = getSlotManager(providerName);
      if (updateDirty(slotManager)) {
        setState({ ...slotManager });
      }
    }
    return () => {
      cancelAnimationFrame(animationFrameHandle);
    };
  });
  return (
    <SlotContext.Provider value={state}>{props.children}</SlotContext.Provider>
  );
}
