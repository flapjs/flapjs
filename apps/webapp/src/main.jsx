import React from 'react';
import ReactDOM from 'react-dom/client';

import App from 'src/app/experimental/App';

window.addEventListener('DOMContentLoaded', () => {
    try {
        if (App['onWindowLoad']) {
            App.onWindowLoad.call(App);
        }
    } catch (e) {
        throw e;
    }

    const root = ReactDOM.createRoot(document.querySelector('#root'));
    function render() {
        requestAnimationFrame(render);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
    render();
});
