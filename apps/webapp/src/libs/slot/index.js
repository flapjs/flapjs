export { Slot } from './Slot';
export { SlotProvider, useSlotContext } from './SlotContext';

/**
 * @module SlotService
 * 
 * ## Setup
 * - Put `<SlotProvider/>` at top level before using any `<Slot/>`.
 * 
 * ## Usage
 * - Put `<Slot/>` wherever you want to inject content.
 * - Call `SlotProvider.clearAll()` to clear content, usually on destroy.
 * - Call `SlotProvider.refresh()` to inject content, usually on load.
 */
