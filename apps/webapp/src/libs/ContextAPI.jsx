import React from 'react';

/**
 * @template T
 * @callback ContextAPICallback<T>
 * @param {Object} props
 * @returns {T} The context api object.
 */

/**
 * @template T
 * @callback UseContextHook<T>
 * @returns {T} The context api object.
 */

/**
 * @template T
 * @typedef ContextAPI<T>
 * @property {React.FunctionComponent} Provider The context provider.
 * @property {React.Consumer<T>} Consumer The context consumer component.
 * @property {UseContextHook<T>} useContext The context consumer hook.
 */

/**
 * @template T
 * @param {ContextAPICallback<T>} contextAPICallback
 * @returns {ContextAPI<T>} The context provider, consumer, and use hook.
 */
export function createContextAPI(contextAPICallback, defaultAPI = null) {
    const Context = React.createContext(defaultAPI);

    /**
     * @param {object} props 
     * @param {React.ReactNode} [props.children]
     */
    function Provider(props) {
        const { children } = props;
        const contextAPI = contextAPICallback(props);
        return (
            <Context.Provider value={contextAPI}>
                {children}
            </Context.Provider>
        );
    }

    function useContext() {
        const ctx = React.useContext(Context);
        if (!ctx) {
            throw new Error(`Context hook must be called from descendent of missing context provider '${contextAPICallback.name}'.`);
        }
        return ctx;
    }

    return {
        Provider,
        Consumer: Context.Consumer,
        useContext,
    };
}
