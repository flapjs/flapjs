import React from 'react';
import { Logger } from 'src/libs/logger';

import {
  SlotContext,
  markDirty,
  SLOT_MANAGERS,
  DIRTY_KEY,
} from './SlotContext.jsx';

const LOGGER = new Logger('SlotService');

const DEFAULT_SLOT_NAME = '__DEFAULT__';
const DEFAULT_CONTENT_KEY = '__DEFAULT__';

/**
 * This class represents the slot-like behavior of web component's own <slot> tag. To
 * use this, you must first define <Slot.Provider name="..."> at the root (the "name"
 * prop is required and must be globally unique). There can be multiple providers
 * (with globally unique names) but all <Slot> related components must go under a provider.
 * Then, simply define <Slot> where you want to be able to inject content to.
 *
 * __NOTE: All slots that share the same names will also share injected content, albeit rendered
 * separately.__
 *
 * There are currently 2 methods to inject content into a <Slot>:
 *
 * # Using Slot.inject()
 *
 * You can do it imperatively by calling Slot.inject() with the appropriate provider name
 * and the component to inject. It can be called even before the provider has mounted; it
 * will wait for it to be defined. By default, it will inject into the first unnamed <Slot>.
 * For named slots, provide the slot's name as a parameter.
 *
 * __NOTE: Because inject() cannot know if you intend to keep certain slot content or want them
 * erased on re-render, it will assume the former. It is up to you to reject() or clear()
 * the slots if it should be empty. You can check if your content has been overriden by
 * other content with contains(). This is not an issue, however, if using <Slot.Consumer>.__
 *
 * Refer to the function definition for more information.
 *
 * # Using <Slot.Consumer>
 *
 * You can do it declaratively by using <Slot.Consumer>. It takes the component you want
 * to inject as props. This will usually override any Slot.inject() content due to it being
 * called during the render cycle (which usually happens AFTER all imperative code). When
 * <Slot.Consumer> is removed from render, then the content will also be removed from the
 * slot automatically (as long as it was not overriden).
 *
 * __NOTE: It cannot take any children.__
 *
 * # Multiple Slots or Contents
 *
 * If you have multiple slots, you can give them optional names and inject to those slots
 * by giving its name (explained further below).
 *
 * If you have multiple contents for a single slot but do not want to override one another
 * (in other words, you want an "array" of content for that slot), you can inject with
 * "contentKey" that unique identifies that piece of content. Any injections with the same
 * key (in the same slot) will be treated as an "override" of content, otherwise they will
 * be rendered as siblings.
 * 
 * @param {object} props
 * @param {string} props.name
 * @param {'default'|'consumer'|'wrapper'} [props.mode = 'default']
 * @param {React.ReactNode} [props.children]
 */
export function Slot(props) {
  const { name = DEFAULT_SLOT_NAME, mode = 'default', children } = props;
  return (
    <SlotContext.Consumer>
      {(slotManager) => {
        let slots = slotManager.slots;
        if (slots[name]) {
          slots[name][DIRTY_KEY] = false;
          return (
            <>
              {mode === 'consumer'
                ? // @ts-ignore => It expects a function as it's child.
                children.call(undefined, Object.values(slots[name]))
                : mode === 'wrapper'
                  ? Object.values(slots[name]).reduceRight(
                    (prev, { component: Component, props }) => {
                      return <Component {...props}> {prev} </Component>;
                    },
                    children
                  )
                  : Object.entries(slots[name]).map(
                    ([key, { component: Component, props }]) => {
                      return <Component key={key} {...props} />;
                    }
                  )}
            </>
          );
        } else {
          return (
            <>
              {mode === 'consumer'
                ? // @ts-ignore => It expects a function as it's child.
                children.call(undefined, [])
                : children || ''}
            </>
          );
        }
      }}
    </SlotContext.Consumer>
  );
}

Slot.inject = inject;
Slot.reject = reject;
Slot.contains = contains;
Slot.clear = clear;
Slot.clearAll = clearAll;

/**
 * Injects the content into an unnamed slot or a named target slot.
 *
 * @param {string} providerName The globally unique name of the provider for the target slot.
 * @param {typeof React.Component} componentClass A react component class to inject into the slot.
 * @param {object} [componentProps] The props object to render with.
 * @param {string} [slotName] The name of the slot to inject into.
 * @param {string} [contentKey] The content key to uniquely identify this content from others injecting
 * into the same slot. This will prevent this call from overriding other keyed content (though it will
 * override content with the same key).
 */
function inject(
  providerName,
  componentClass,
  componentProps = {},
  slotName = DEFAULT_SLOT_NAME,
  contentKey = DEFAULT_CONTENT_KEY
) {
  if (!providerName) {
    LOGGER.error('Missing provider name for slot content inject.');
    return;
  }

  if (!SLOT_MANAGERS.has(providerName))
    SLOT_MANAGERS.set(providerName, {
      name: providerName,
      slots: {},
      [DIRTY_KEY]: true,
    });
  let slotManager = SLOT_MANAGERS.get(providerName);
  let slots = slotManager.slots;
  if (!(slotName in slots)) slots[slotName] = {};
  let contents = slots[slotName];
  if (contentKey in contents) {
    if (isSameContent(componentClass, componentProps, contents[contentKey])) {
      // Don't need to update anything, it's good.
      return;
    }
  }

  contents[contentKey] = {
    component: componentClass,
    props: componentProps,
    [DIRTY_KEY]: true,
  };
  markDirty(slotManager, slotName, contentKey);
}

/**
 * Checks whether the target slot contains the "same" content. This effectively performs a Object.is()
 * comparison on the component class itself and the between the entries of the props.
 *
 * @param {string} providerName The globally unique name of the provider for the target slot.
 * @param {typeof React.Component} componentClass A react component class to check for in the slot.
 * @param {object} [componentProps] The props object to check for in the slot.
 * @param {string} [slotName] The name of the target slot.
 * @param {string} [contentKey] The content key for the target slot content.
 * @returns {boolean} Whether the slot contains the "same" content.
 */
function contains(
  providerName,
  componentClass,
  componentProps = undefined,
  slotName = DEFAULT_SLOT_NAME,
  contentKey = DEFAULT_CONTENT_KEY
) {
  if (!providerName) {
    LOGGER.error('Missing provider name for slot content contains.');
    return;
  }

  if (SLOT_MANAGERS.has(providerName)) {
    let slotManager = SLOT_MANAGERS.get(providerName);
    if (slotName in slotManager.slots) {
      let contents = slotManager.slots[slotName];
      if (contentKey in contents) {
        if (
          isSameContent(componentClass, componentProps, contents[contentKey])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Forces a single piece of content in a slot to be empty. In other words, this will not "clear"
 * content that do not match it's content key. If no content key is defined, it will only remove
 * the un-keyed content.
 *
 * @param {string} providerName The globally unique name of the provider for the target slot.
 * @param {string} slotName The target slot name.
 * @param {string} contentKey The target content key to clear.
 */
function reject(
  providerName,
  slotName = DEFAULT_SLOT_NAME,
  contentKey = DEFAULT_CONTENT_KEY
) {
  if (!providerName) {
    LOGGER.error('Missing provider name for slot content reject.');
    return;
  }

  if (SLOT_MANAGERS.has(providerName)) {
    let slotManager = SLOT_MANAGERS.get(providerName);
    if (slotName in slotManager.slots) {
      let contents = slotManager.slots[slotName];
      if (contentKey in contents) {
        delete contents[contentKey];
        markDirty(slotManager, slotName);
      }
    }
  }
}

/**
 * Clears a given slot of all content. If no slot is given, then it will clear the unnamed slot.
 *
 * @param {string} providerName The globally unique name of the provider for the target slot.
 * @param {string} slotName The target slot name.
 */
function clear(providerName, slotName = DEFAULT_SLOT_NAME) {
  if (!providerName) {
    LOGGER.error('Missing provider name for slot content clear.');
    return;
  }

  if (SLOT_MANAGERS.has(providerName)) {
    let slotManager = SLOT_MANAGERS.get(providerName);
    if (slotName in slotManager.slots) {
      delete slotManager.slots[slotName];
      markDirty(slotManager);
    }
  }
}

/**
 * Clears all slots under the provider, including the unnamed slot.
 *
 * @param {string} providerName The globally unique name of the provider for the target slot.
 */
function clearAll(providerName) {
  if (!providerName) {
    LOGGER.error('Missing provider name for slot content clearAll.');
    return;
  }

  if (!SLOT_MANAGERS.has(providerName)) return;
  let slotManager = SLOT_MANAGERS.get(providerName);
  if (Object.keys(slotManager.slots).length <= 0) return;
  slotManager.slots = {};
  markDirty(slotManager);
}

function isSameContent(componentClass, componentProps, otherContent) {
  const { component, props } = otherContent;
  if (Object.is(componentClass, component)) {
    if (isSameProps(componentProps, props)) {
      return true;
    }
  }
}

function isSameProps(props, other) {
  let otherEntries = Object.entries(other);
  let propEntries = Object.entries(props);
  if (otherEntries.length === propEntries.length) {
    const length = otherEntries.length;
    for (let i = 0; i < length; ++i) {
      let otherEntry = otherEntries[i];
      let propEntry = propEntries[i];
      if (
        Object.is(otherEntry[0], propEntry[0]) &&
        Object.is(otherEntry[1], propEntry[1])
      ) {
        return true;
      }
    }
  }
  return false;
}
