import BaseService from '../base/BaseService.js';
import ViewService from '../view/ViewService.js';

import { GraphProvider } from './GraphContext.jsx';
import { GraphElementEditorProvider } from './widgets/editor/GraphElementEditorContext.jsx';

import BaseGraph from './BaseGraph.js';

import GraphElementEditor from './widgets/editor/GraphElementEditor.jsx';

export default class GraphService extends BaseService
{
    /** @override */
    static get services() { return [ ViewService ]; }
    /** @override */
    static get providers()
    {
        return [
            { component: GraphProvider, props: { graphType: BaseGraph } },
            GraphElementEditorProvider
        ];
    }
    /** @override */
    static get renders()
    {
        return {
            playarea: [],
            viewarea: [ GraphElementEditor ]
        };
    }
    /** @override */
    static get serviceVersion() { return '1.0.0'; }
}

/**
 * Creates another GraphService with the given graph type.
 *
 * @param {Class<NodeGraph>} graphType The chosen graph type.
 * @param {Class<NodeGraphPlayground>} [graphPlayground] The complementary playground.
 * @returns {Class<GraphService>} The new GraphService with reducer function.
 */
GraphService.withGraphType = (graphType, graphPlayground = undefined) =>
{
    return class extends GraphService
    {
        constructor(loader, contribs)
        {
            super(loader, contribs);

            // GraphProvider
            contribs.providers[0].props.graphType = graphType;

            // "playarea" render slot
            if (graphPlayground)
            {
                contribs.playarea.push({ component: graphPlayground });
            }
        }
    };
};
