import SessionExporter from '@flapjs/session/helper/SessionExporter.js';

import { RunningManIcon as JSONFileIcon } from '@flapjs/components/icons/Icons.js';

/**
 * A class that represents a session exporter for the FSA module.
 */
class FSAExporter extends SessionExporter
{
    constructor(jsonGraphParser)
    {
        super('.fsa.json');
        this._graphParser = jsonGraphParser;
    }

    /** @override */
    onExportSession(session, dst)
    {
        const graphController = session.graphController;
        const graph = graphController.getGraph();
        const graphData = this._graphParser.compose(graph);

        dst['graphData'] = graphData;
        /*
        const machineController = currentModule.getMachineController();
        dst['machineData'] = {
            type: machineController.getMachineType(),
            symbols: machineController.getCustomSymbols(),
            statePrefix: graphController.getGraphLabeler().getDefaultNodeLabelPrefix()
        };
        */
    }

    /** @override */
    getIconClass() { return JSONFileIcon; }

    /** @override */
    getLabel() { return 'file.export.machine'; }

    /** @override */
    getTitle() { return 'file.export.machine.hint'; }
}

export default FSAExporter;
