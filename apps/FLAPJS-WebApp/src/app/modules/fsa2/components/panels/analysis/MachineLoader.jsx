import TextUploader from 'util/file/import/TextUploader';
import FSAGraphParser from 'modules/fsa2/filehandlers/FSAGraphParser';
import FSAGraph from 'modules/fsa2/graph/FSAGraph';
import FSABuilder from 'modules/fsa2/machine/FSABuilder';
import FSA from 'modules/fsa2/machine/FSA';

export function createMachineFromFileBlob(fileBlob)
{
    return new Promise((resolve, reject) =>
    {
        new TextUploader().uploadFile(fileBlob)
            .then(result =>
            {
                const fileData = JSON.parse(result);

                const graphParser = new FSAGraphParser();
                const graph = new FSAGraph();
                graphParser.parse(fileData['graphData'], graph);

                const machineBuilder = new FSABuilder();
                const machine = new FSA();
                machineBuilder.attemptBuildMachine(graph, machine);
                
                if (machine)
                {
                    resolve(machine);
                }
                else
                {
                    resolve(null);
                }
            });
    });
}