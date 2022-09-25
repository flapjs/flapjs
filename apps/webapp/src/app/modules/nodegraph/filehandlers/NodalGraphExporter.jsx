import SessionExporter from 'src/app/session/SessionExporter';

import JSONFileIcon from 'src/app/components/iconset/flat/JSONFileIcon';

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
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const graph = graphController.getGraph();
        const graphData = this._graphParser.objectify(graph);

        dst['graphData'] = graphData;
    }

    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.machine'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.machine.hint'); }
}

export default NodalGraphExporter;
