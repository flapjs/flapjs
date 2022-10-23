import React, { useRef } from 'react';
import { useContext } from 'react';
import { refresh, createSlotted, clearAll, inject } from './SlotHelpers';

const SLOTS = { slots: {} };
export const SlotContext = React.createContext(SLOTS);

/**
 * @param {object} props 
 * @param {React.ReactNode} [props.children]
 */
export function SlotProvider({ children }) {
  const api = useRef(SLOTS);
  return (
    <SlotContext.Provider value={api.current}>
      {children}
    </SlotContext.Provider>
  );
}
SlotProvider.inject = inject;
SlotProvider.clearAll = clearAll;
SlotProvider.refresh = refresh;
SlotProvider.createSlotted = createSlotted;

export function useSlotContext() {
  let ctx = useContext(SlotContext);
  if (!ctx) {
    throw new Error('Unsupported operation - missing provider SlotProvider');
  }
  return ctx;
}
