import React, { useState, useEffect } from 'react';
import { Slot } from './Slot';

export const SLOT_MANAGERS = new Map();
export const DIRTY_KEY = Symbol('dirty');

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
      if (SLOT_MANAGERS.has(name)) {
        // Clean-up time!

        // NOTE: We clean up here instead of in SlotContextProvider because that
        // context could re-render due to state change. However, this component
        // only handles the "name" of the provider. Which, if it changes, could
        // be assumed as a delete or clear (because all provider names are assumed
        // globally unique and are tied to that state).
        let slotManager = SLOT_MANAGERS.get(name);
        slotManager[DIRTY_KEY] = true;
        slotManager.slots = {};
      }
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
SlotProvider.refresh = SlotProviderRefresh;
SlotProvider.createSlotted = SlotProviderCreateSlotted;

/**
 * 
 * @param {string} providerName 
 * @param {string} slotName 
 * @param {typeof React.Component} componentClass 
 * @param {object} props 
 * @param {string} key 
 * @returns 
 */
function SlotProviderCreateSlotted(providerName, slotName, componentClass, props, key) {
  return {
    provider: providerName,
    slot: slotName,
    component: componentClass,
    props,
    key,
  };
}

/**
 * @param {string} providerName 
 * @param {Array<ReturnType<SlotProviderCreateSlotted>>} slotted 
 */
function SlotProviderRefresh(providerName, slotted) {
  Slot.clearAll(providerName);
  for(let { provider, slot, component, props, key } of slotted) {
    if (provider !== providerName) continue;
    Slot.inject(provider, component, props, slot, key);
  }
}

function SlotContextProvider(props) {
  const { providerName } = props;

  let slotManager;
  if (!SLOT_MANAGERS.has(providerName)) {
    SLOT_MANAGERS.set(providerName, {
      name: providerName,
      slots: {},
      [DIRTY_KEY]: true,
    });
  }
  slotManager = SLOT_MANAGERS.get(providerName);

  const [state, setState] = useState(slotManager);

  useEffect(() => {
    let animationFrameHandle = requestAnimationFrame(onAnimationFrame);
    function onAnimationFrame(now) {
      animationFrameHandle = requestAnimationFrame(onAnimationFrame);
      let slotManager = SLOT_MANAGERS.get(providerName);
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

export function updateDirty(slotManager) {
  // NOTE: We use a symbol as the property because it is, by default, not enumerable.
  if (slotManager[DIRTY_KEY]) {
    /*
        // NOTE: We do not update dirty for the individual slots; they will manage their own in their render method.
        for(let slotContents of Object.values(slotManager.slots))
        {
            if (slotContents[DIRTY_KEY])
            {
                for(let slotContent of Object.values(slotContents))
                {
                    if (slotContent[DIRTY_KEY])
                    {
                        slotContent[DIRTY_KEY] = false;
                    }
                }
                slotContents[DIRTY_KEY] = false;
            }
        }
        */
    slotManager[DIRTY_KEY] = false;
    return true;
  }
  return false;
}

export function markDirty(
  slotManager,
  slotName = undefined,
  contentKey = undefined
) {
  slotManager[DIRTY_KEY] = true;
  if (slotName) slotManager.slots[slotName][DIRTY_KEY] = true;

  // NOTE: This dirty flag is unused, since if any slot content is dirty,
  // we re-render the entire slot.
  // if (contentKey) slotManager.slots[slotName][contentKey][DIRTY_KEY] = true;
}
