import IndexedNodeGraph from 'src/graph2/IndexedNodeGraph';

import FSANode from './element/FSANode';
import FSAEdge from './element/FSAEdge';

class FSAGraph extends IndexedNodeGraph {
  constructor() {
    super(FSANode, FSAEdge);
  }
}

export default FSAGraph;
