import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'src/components/App';
import { Logger } from './libs/logger';
import { Slot, SlotProvider } from './libs/slot';
import { SessionProvider, useSession } from './session/SessionContext';

Logger.setLevel(Logger.INFO);

window.addEventListener('DOMContentLoaded', () => {
  try {
    if (App['onWindowLoad']) {
      App.onWindowLoad.call(App);
    }
  } catch (e) {
    throw e;
  }

  const root = ReactDOM.createRoot(document.querySelector('#root'));
  root.render(
      <React.StrictMode>
        <SessionProvider>
          <SlotProvider name="app">
            <Slot name="init"/>
            <SessionApp/>
          </SlotProvider>
        </SessionProvider>
      </React.StrictMode>
  );
});

function SessionApp() {
  const session = useSession();
  return (
    <App session={session}/>
  )
}
