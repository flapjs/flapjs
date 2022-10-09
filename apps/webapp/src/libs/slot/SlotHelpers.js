import { Logger } from 'src/libs/logger';

const LOGGER = new Logger('SlotService');
export const SLOT_MANAGERS = new Map();

export const DEFAULT_SLOT_NAME = '__DEFAULT__';
export const DEFAULT_CONTENT_KEY = '__DEFAULT__';
export const DIRTY_KEY = Symbol('dirty');

export function getSlotManager(providerName) {
    return SLOT_MANAGERS.get(providerName);
}

export function createSlotManager(providerName) {
    if (!SLOT_MANAGERS.has(providerName)) {
        let result = {
            name: providerName,
            slots: {},
            [DIRTY_KEY]: true,
        };
        SLOT_MANAGERS.set(providerName, result);
        return result;
    }
    return SLOT_MANAGERS.get(providerName);
}

/**
 * 
 * @param {string} providerName 
 * @param {string} slotName 
 * @param {typeof React.Component} componentClass 
 * @param {object} props 
 * @param {string} key 
 * @returns 
 */
export function createSlotted(providerName, slotName, componentClass, props, key) {
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
 * @param {Array<ReturnType<createSlotted>>} slotted 
 */
export function refresh(providerName, slotted) {
    clearAll(providerName);
    for (let { provider, slot, component, props, key } of slotted) {
        if (provider !== providerName) continue;
        inject(provider, component, props, slot, key);
    }
}

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
export function inject(
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

    let slotManager = createSlotManager(providerName);
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
export function contains(
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

    let slotManager = getSlotManager(providerName);
    if (slotManager) {
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
export function reject(
    providerName,
    slotName = DEFAULT_SLOT_NAME,
    contentKey = DEFAULT_CONTENT_KEY
) {
    if (!providerName) {
        LOGGER.error('Missing provider name for slot content reject.');
        return;
    }

    let slotManager = getSlotManager(providerName);
    if (slotManager) {
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
export function clear(providerName, slotName = DEFAULT_SLOT_NAME) {
    if (!providerName) {
        LOGGER.error('Missing provider name for slot content clear.');
        return;
    }

    let slotManager = getSlotManager(providerName);
    if (slotManager) {
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
export function clearAll(providerName) {
    if (!providerName) {
        LOGGER.error('Missing provider name for slot content clearAll.');
        return;
    }

    let slotManager = getSlotManager(providerName);
    if (!slotManager) return;
    if (Object.keys(slotManager.slots).length <= 0) return;
    slotManager.slots = {};
    markDirty(slotManager);
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
