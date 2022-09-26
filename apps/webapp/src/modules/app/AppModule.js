import { AppInit } from './AppInit';

export default class AppModule {
    static get moduleId() {
        return 'app';
    }

    static get moduleVersion() {
        return '1.0.0';
    }

    static get renderers() {
        return [
            { render: AppInit, on: 'init' },
        ];
    }
}
