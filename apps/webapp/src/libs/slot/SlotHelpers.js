import { Logger } from 'src/libs/logger';

const LOGGER = new Logger('SlotService');

/**
 * @typedef SlotContext
 * @property {Record<string, object>} slots 
 */

export const DEFAULT_SLOT_NAME = '__DEFAULT__';
export const DEFAULT_CONTENT_KEY = '__DEFAULT__';
export const DIRTY_KEY = Symbol('dirty');

export function resolveSlot(slotContext, slotName) {
    const { slots } = slotContext;
    if (!(slotName in slots)) {
        slots[slotName] = createSlotInfo();
    }
    return slots[slotName];
}

/**
 * @param {string} slotName 
 * @param {typeof React.Component} componentClass 
 * @param {object} props 
 * @param {string} key
 */
export function createSlotted(slotName, componentClass, props, key) {
    return {
        slot: slotName,
        component: componentClass,
        props,
        key,
    };
}

/**
 * @param {SlotContext} slotContext 
 * @param {Array<ReturnType<createSlotted>>} slotted 
 */
export function refresh(slotContext, slotted) {
    if (!slotContext) {
        throw new Error('Missing slot context.');
    }
    clearAll(slotContext);
    for (let { slot, component, props, key } of slotted) {
        inject(slotContext, component, props, slot, key);
    }
}

function createSlotInfo() {
    return {
        contents: {},
        children: [],
        forceUpdate: null,
    };
}

/**
 * Injects the content into an unnamed slot or a named target slot.
 *
 * @param {SlotContext} slotContext The globally unique name of the provider for the target slot.
 * @param {typeof React.Component} componentClass A react component class to inject into the slot.
 * @param {object} [componentProps] The props object to render with.
 * @param {string} [slotName] The name of the slot to inject into.
 * @param {string} [contentKey] The content key to uniquely identify this content from others injecting
 * into the same slot. This will prevent this call from overriding other keyed content (though it will
 * override content with the same key).
 */
export function inject(
    slotContext,
    componentClass,
    componentProps = {},
    slotName = DEFAULT_SLOT_NAME,
    contentKey = DEFAULT_CONTENT_KEY
) {
    if (!slotContext) {
        LOGGER.error('Missing provider for slot context inject.');
        return;
    }
    let slotInfo = resolveSlot(slotContext, slotName);
    let contents = slotInfo.contents;
    let dirty = true;
    if (contentKey in contents) {
        if (isSameContent(componentClass, componentProps, contents[contentKey])) {
            // Don't need to update anything, it's good.
            dirty = false;
        }
    }
    contents[contentKey] = {
        component: componentClass,
        props: componentProps,
    };
    if (dirty && slotInfo.forceUpdate) {
        slotInfo.forceUpdate();
    }
}

/**
 * Clears all slots under the provider, including the unnamed slot.
 *
 * @param {SlotContext} slotContext The globally unique name of the provider for the target slot.
 */
export function clearAll(slotContext) {
    if (!slotContext) {
        LOGGER.error('Missing provider for slot context clearAll.');
        return;
    }
    if (Object.keys(slotContext.slots).length <= 0) return;
    for(let slotName of Object.keys(slotContext.slots)) {
        slotContext.slots[slotName].contents = {};
        if (slotContext.slots[slotName].forceUpdate) {
            slotContext.slots[slotName].forceUpdate();
        }
    }
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
