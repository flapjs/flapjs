import BaseModule from '../base/BaseModule.js';

import ExportPanel from './ExportPanel.jsx';

import GraphService from '@flapjs/services2/graph/GraphService.js';

export default class NodeModule extends BaseModule
{
    /** @override */
    static get moduleId() { return 'node'; }
    /** @override */
    static get moduleVersion() { return '1.0.0'; }

    /** @override */
    static get services()
    {
        return [
            GraphService
        ];
    }

    /** @override */
    static get providers()
    {
        return [];
    }

    /** @override */
    static get renders()
    {
        return {
            drawer: [ ExportPanel ],
            playground: [],
        };
    }
}
