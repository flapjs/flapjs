import { SlotProvider } from 'src/libs/slot/SlotContext';

export function loadModules(app, modules) {
    let slotted = getSlottedForModules(app, modules);
    SlotProvider.refresh('app', slotted);
}

/**
 * @param {object} app 
 * @param {Array<?>} modules
 */
function getSlottedForModules(app, modules) {
    let result = [];
    for (let module of modules) {
        let moduleClass = module.constructor;
        let superProps = {
            app,
            module,
        };
        let i = 1;
        let slotted = moduleClass.renderers;
        if (Array.isArray(slotted)) {
            for (let { consume = undefined, provide = undefined, render = undefined, props = {}, on } of slotted) {
                let key = `${moduleClass.moduleId}${i++}`;
                result.push(SlotProvider.createSlotted('app', on, render || provide || consume, {
                    ...props,
                    ...superProps,
                }, key));
            }
        }
    }
    return result;
}
