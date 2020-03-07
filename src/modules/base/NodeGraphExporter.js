import SessionExporter from '@flapjs/session/loaders/SessionExporter.js';

import { RunningManIcon } from '@flapjs/components2/icons/Icons.js';

class NodalGraphExporter extends SessionExporter
{
    constructor(jsonGraphParser)
    {
        super('.node.json');
        this._graphParser = jsonGraphParser;
    }

    /** @override */
    onExportSession(session, dst)
    {
        const graphController = session.graphService.graphController;
        const graph = graphController.getGraph();
        const graphData = this._graphParser.compose(graph);

        dst['graphData'] = graphData;
    }

    /** @override */
    getIconClass() { return RunningManIcon; }
    /** @override */
    getLabel() { return 'file.export.machine'; }
    /** @override */
    getTitle() { return 'file.export.machine.hint'; }
}

export default NodalGraphExporter;
