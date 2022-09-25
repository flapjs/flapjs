import SessionExporter from 'src/app/session/SessionExporter';

import JSONFileIcon from 'src/assets/icons/file-json.svg';

class REExporter extends SessionExporter
{
    constructor()
    {
        super('.re.json');
    }

    /** @override */
    onExportSession(session, dst)
    {
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();

        dst['machineData'] = {
            expression: machineController.getMachineExpression()
        };
    }
    
    /** @override */
    getIconClass() { return JSONFileIcon; }
    /** @override */
    getLabel() { return I18N.toString('file.export.machine'); }
    /** @override */
    getTitle() { return I18N.toString('file.export.machine.hint'); }
}

export default REExporter;
