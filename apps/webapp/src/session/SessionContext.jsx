import React, { useEffect, useContext } from 'react';

import App from 'src/components/App';
import { useSlotContext } from 'src/libs/slot';
import Session from 'src/session/Session';

export const SessionContext = React.createContext(null);

const SESSION_INSTANCE = new Session();

export function SessionProvider({ children }) {
    const slotContext = useSlotContext();
    useEffect(() => {
        SESSION_INSTANCE.startSession(App.INSTANCE, undefined, slotContext);
        return () => {
            SESSION_INSTANCE.stopSession(App.INSTANCE, slotContext);
        };
    });
    return (
        <SessionContext.Provider value={SESSION_INSTANCE}>
            {children}
        </SessionContext.Provider>
    );
}

export function SessionConsumer({ children }) {
    return (
        <SessionContext.Consumer>
            {children}
        </SessionContext.Consumer>
    );
}

export function useSession() {
    let result = useContext(SessionContext);
    if (!result) {
        throw new Error('Missing SessionProvider.');
    }
    return result;
}
