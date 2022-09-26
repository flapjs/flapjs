import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'src/components/App';
import { Slot, SlotProvider } from './libs/slot';

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
        <SlotProvider name="app">
          <Slot name="init"/>
          <App/>
        </SlotProvider>
      </React.StrictMode>
  );
});
