import React from 'react';
import { clear, clearAll, contains, DEFAULT_SLOT_NAME, inject, reject, DIRTY_KEY } from './SlotHelpers';

import { SlotContext } from './SlotContext';

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
