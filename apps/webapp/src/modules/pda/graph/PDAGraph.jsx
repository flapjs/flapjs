import IndexedNodeGraph from 'src/graph2/IndexedNodeGraph';

import PDANode from './element/PDANode';
import PDAEdge from './element/PDAEdge';

class PDAGraph extends IndexedNodeGraph
{
    constructor()
    {
        super(PDANode, PDAEdge);
    }
}

export default PDAGraph;
