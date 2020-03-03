import BaseService from '@flapjs/services2/base/BaseService.js';
import { withChildSlot } from '@flapjs/util/slot/SlotHelper.js';

import { ViewProvider } from './ViewContext.jsx';
import ViewArea from './components/ViewArea.jsx';
import PlayArea from './components/PlayArea.jsx';

// NOTE: Maybe this should be called PlaygroundService?
export default class ViewService extends BaseService
{
    /** @override */
    static get providers() { return [ ViewProvider ]; }
    /** @override */
    static get renders()
    {
        return {
            background: [ withChildSlot('playarea', PlayArea) ],
            foreground: [ withChildSlot('viewarea', ViewArea) ],
        };
    }
    /** @override */
    static get serviceVersion() { return '1.0.0'; }
}
