import React, { useEffect, useContext } from 'react';

import App from 'src/components/App';
import Session from 'src/session/Session';

export const SessionContext = React.createContext(null);

const SESSION_INSTANCE = new Session();

export function SessionProvider({ children }) {
    useEffect(() => {
        console.log('START');
        SESSION_INSTANCE.startSession(App.INSTANCE);
        return () => {
            console.log('STOP');
            SESSION_INSTANCE.stopSession(App.INSTANCE);
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
