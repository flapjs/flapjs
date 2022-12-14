import React, { useRef } from 'react';
import { DEFAULT_SLOT_NAME, resolveSlot } from './SlotHelpers';

import { useSlotContext } from './SlotContext';
import { useForceUpdate } from 'src/hooks/ForceUpdate';

/**
 * @callback OnSlottedCallback
 * @param {React.FC} Component
 * @param {object} props
 * @param {React.ReactNode} children
 * @param {string} key
 * @param {number} index
 * @param {Array<[key: string, slotted: object]>} array
 * @return {React.ReactNode}
 */

/**
 * This class represents the slot-like behavior of web component's own <slot> tag. To
 * use this, you must first define <SlotProvider name="..."> at the root (the "name"
 * prop is required and must be globally unique). There can be multiple providers
 * (with globally unique names) but all <Slot> related components must go under a provider.
 * Then, simply define <Slot> where you want to be able to inject content to.
 *
 * __NOTE: All slots that share the same names will also share injected content, albeit rendered
 * separately.__
 *
 * There are currently 2 methods to inject content into a <Slot>:
 *
 * # Using SlotProvider.inject()
 *
 * You can do it imperatively by calling SlotProvider.inject() with the appropriate provider name
 * and the component to inject. It can be called even before the provider has mounted; it
 * will wait for it to be defined. By default, it will inject into the first unnamed <Slot>.
 * For named slots, provide the slot's name as a parameter.
 *
 * __NOTE: Because inject() cannot know if you intend to keep certain slot content or want them
 * erased on re-render, it will assume the former. It is up to you to reject() or clear()
 * the slots if it should be empty. You can check if your content has been overriden by
 * other content with contains(). This is not an issue, however, if using <SlotProvider.Consumer>.__
 *
 * Refer to the function definition for more information.
 *
 * # Using <SlotProvider.Consumer>
 *
 * You can do it declaratively by using <SlotProvider.Consumer>. It takes the component you want
 * to inject as props. This will usually override any SlotProvider.inject() content due to it being
 * called during the render cycle (which usually happens AFTER all imperative code). When
 * <SlotProvider.Consumer> is removed from render, then the content will also be removed from the
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
 * @param {'renderer'|'consumer'|'provider'} [props.mode]
 * @param {object} [props.slottedProps]
 * @param {OnSlottedCallback} [props.onSlotted]
 * @param {React.ReactNode} [props.children]
 */
export function Slot(props) {
  const {
    name = DEFAULT_SLOT_NAME,
    mode = 'renderer',
    slottedProps = {},
    onSlotted = undefined,
  } = props;
  const forceUpdate = useForceUpdate();
  const slotContext = useSlotContext();
  const slotInfo = resolveSlot(slotContext, name);
  const { contents } = slotInfo;
  slotInfo.forceUpdate = forceUpdate;
  slotInfo.children = props.children;
  let result = null;
  switch(mode) {
    case 'consumer':
      if (onSlotted) {
        throw new Error(`Unsupported operation - 'onSlottedProps' cannot be used for consumer slots.`);
      }
      if (props.children) {
        // @ts-ignore => It expects a function as it's child.
        result = props.children.call(undefined, Object.values(contents));
        slotInfo.children = result;
        return result;
      }
    case 'provider':
      result = Object.entries(contents).reduceRight(
        (prev, [key, { component: Component, props }], i, array) => {
          let childProps = { ...slottedProps, ...props };
          if (onSlotted) {
            return onSlotted(Component, childProps, prev, key, i, array);
          } else {
            return (
              <Component key={key} {...childProps}>
                {prev}
              </Component>
            );
          }
        },
        props.children
      );
      slotInfo.children = result;
      return result;
    case 'renderer':
    default:
      result = Object.entries(contents).map(
        ([key, { component: Component, props }], i, array) => {
          let childProps = { ...slottedProps, ...props };
          if (onSlotted) {
            return onSlotted(Component, childProps, undefined, key, i, array);
          } else {
            return <Component key={key} {...childProps} />
          }
        }
      );
      slotInfo.children = result;
      return result;
  }
}
