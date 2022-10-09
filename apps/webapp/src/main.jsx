import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'src/components/App';
import { Logger } from './libs/logger';
import { Slot, SlotProvider } from './libs/slot';
import { SessionProvider, useSession } from './session/SessionContext';
import { LocaleProvider } from './libs/i18n';

Logger.setLevel(Logger.DEBUG);

window.addEventListener('DOMContentLoaded', () => {
  try {
    if (App['onWindowLoad']) {
      App.onWindowLoad.call(App);
    }
  } catch (e) {
    throw e;
  }

  const root = ReactDOM.createRoot(document.querySelector('#root'));
  // TODO: Providers make the toolbar disappear for some reason :(
  root.render(
      <React.StrictMode>
        <SessionProvider>
          <SlotProvider name="app">
            <LocaleProvider>
              {/*<Slot name="providers" mode="provider">*/}
                <Slot name="init"/>
                <SessionApp/>
              {/*</Slot>*/}
            </LocaleProvider>
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
