import GraphEdge from 'src/graph2/element/GraphEdge';
import GraphNode from 'src/graph2/element/GraphNode';

export function locateTarget(app, targets, targetIndex, setTargetIndex) {
    if (targets.length <= 0) {
        return;
    }
    const target = targets[targetIndex];
    let nextIndex = targetIndex + 1;
    if (nextIndex >= targets.length) {
      nextIndex = 0;
    }
    setTargetIndex(nextIndex);

    const graphView = app.getSession().getCurrentModule().getGraphView();
    console.log(target, target instanceof GraphNode);
    if (target instanceof GraphNode) {
        graphView.moveViewToPosition(target.x, target.y);
    } else if (target instanceof GraphEdge) {
        let center = target.getCenterPoint();
        graphView.moveViewToPosition(center.x, center.y);
    }
}
