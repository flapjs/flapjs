import AbstractInputHandler from 'src/util/input/AbstractInputHandler';
import { lerp } from 'src/util/MathHelper';

import { EVENT_SOURCE_FORWARD_ENDPOINT, EVENT_SOURCE_EDGE, EVENT_SOURCE_LABEL } from 'src/graph2/renderer/EdgeRenderer';
import { EVENT_SOURCE_NODE } from 'src/graph2/renderer/NodeRenderer';

export const GRAPH_EVENT_EDGE_CREATE = 'edge-create';
export const GRAPH_EVENT_EDGE_DELETE = 'edge-delete';
export const GRAPH_EVENT_EDGE_LABEL_CHANGE = 'edge-label-change';
export const GRAPH_EVENT_EDGE_TO_CHANGE = 'edge-to-change';
export const GRAPH_EVENT_EDGE_QUAD_CHANGE = 'edge-quad-change';
export const GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE = 'error-edge-edit-while-delete';

const EDGE_POSITION_INTERPOLATION_DELTA = 0.6;

class GraphEdgeInputHandler extends AbstractInputHandler
{
    constructor(inputController, graphController)
    {
        super();

        this._inputController = inputController;
        this._graphController = graphController;

        this._cachedEdgeQuads = {
            radians: 0,
            length: 0
        };
        this._cachedEdgeTo = null;
        this._cachedPointer = { x: 0, y: 0 };
        this._newEdge = false;

        this._shouldDeleteEdgePlaceholder = false;
        this._shouldDeleteEdgeWithEmptyLabel = false;
    }

    setShouldDeleteEdgePlaceholder(flag)
    {
        this._shouldDeleteEdgePlaceholder = flag;
        return this;
    }

    setShouldDeleteEdgeWithEmptyLabel(flag)
    {
        this._shouldDeleteEdgeWithEmptyLabel = flag;
        return this;
    }

    /** @override */
    onInputEvent(pointer)
    {
        const inputController = this._inputController;
        const currentTargetType = inputController.getCurrentTargetType();

        if (inputController.isTrashMode())
        {
            if (currentTargetType === EVENT_SOURCE_EDGE ||
                currentTargetType === EVENT_SOURCE_FORWARD_ENDPOINT ||
                currentTargetType === EVENT_SOURCE_LABEL)
            {
                const currentTargetSource = inputController.getCurrentTargetSource();
                const graphController = this._graphController;
                graphController.getGraph().deleteEdge(currentTargetSource);
                graphController.emitGraphEvent(GRAPH_EVENT_EDGE_DELETE, {target: currentTargetSource});
                return true;
            }
        }

        if (currentTargetType === EVENT_SOURCE_LABEL || currentTargetType === EVENT_SOURCE_EDGE)
        {
            const currentTargetSource = inputController.getCurrentTargetSource();
            const graphController = this._graphController;
            graphController.openLabelEditor(currentTargetSource, currentTargetSource.getEdgeLabel(),
                (target, value, hasChanged) => 
                {
                    if (this._shouldDeleteEdgeWithEmptyLabel && !value)
                    {
                        graphController.getGraph().deleteEdge(currentTargetSource);
                        graphController.emitGraphEvent(GRAPH_EVENT_EDGE_DELETE, {target: currentTargetSource});
                    }
                    else if (hasChanged)
                    {
                        graphController.emitGraphEvent(GRAPH_EVENT_EDGE_LABEL_CHANGE, {target: currentTargetSource});
                    }
                });
            return true;
        }

        return false;
    }

    /** @override */
    onAltInputEvent(pointer)
    {
        return this.onInputEvent(pointer);
    }

    /** @override */
    onDragStart(pointer)
    {
        const inputController = this._inputController;
        if (inputController.hasActiveTarget()) return false;
        if (inputController.isTrashMode())
        {
            //Don't delete stuff if moving...
            this._graphController.emitGraphEvent(GRAPH_EVENT_EDGE_EDIT_WHILE_DELETE);
            return false;
        }

        const currentTargetType = inputController.getCurrentTargetType();
        if (!inputController.isMoveMode(pointer.getInputAdapter()) && currentTargetType === EVENT_SOURCE_NODE)
        {
            const graphController = this._graphController;
            const graph = graphController.getGraph();

            const currentTargetSource = inputController.getCurrentTargetSource();

            this._cachedEdgeQuads.radians = 0;
            this._cachedEdgeQuads.length = 0;
            this._cachedEdgeTo = null;
            this._newEdge = true;
            this._cachedPointer.x = pointer.x;
            this._cachedPointer.y = pointer.y;

            const targetEdge = graph.createEdge(currentTargetSource, this._cachedPointer);

            inputController.bindActiveTarget(targetEdge, EVENT_SOURCE_FORWARD_ENDPOINT, false);
            inputController.setNodeEventsOnly(true);
            return true;
        }
        else if (currentTargetType === EVENT_SOURCE_FORWARD_ENDPOINT)
        {
            const currentTargetSource = inputController.getCurrentTargetSource();

            this._cachedEdgeQuads.radians = currentTargetSource.getQuadraticRadians();
            this._cachedEdgeQuads.length = currentTargetSource.getQuadraticLength();
            this._cachedEdgeTo = currentTargetSource.getEdgeTo();
            this._newEdge = false;
            this._cachedPointer.x = pointer.x;
            this._cachedPointer.y = pointer.y;

            currentTargetSource.setQuadraticRadians(0);
            currentTargetSource.setQuadraticLength(0);
            currentTargetSource.setEdgeTo(this._cachedPointer);

            inputController.bindActiveTarget(currentTargetSource, currentTargetType, false);
            inputController.setNodeEventsOnly(true);
            return true;
        }
        else if (currentTargetType === EVENT_SOURCE_EDGE)
        {
            const currentTargetSource = inputController.getCurrentTargetSource();

            this._cachedEdgeQuads.radians = currentTargetSource.getQuadraticRadians();
            this._cachedEdgeQuads.length = currentTargetSource.getQuadraticLength();
            this._cachedEdgeTo = currentTargetSource.getEdgeTo();
            this._newEdge = false;
            this._cachedPointer.x = pointer.x;
            this._cachedPointer.y = pointer.y;

            inputController.bindActiveTarget(currentTargetSource, currentTargetType, false);
            return true;
        }

        return false;
    }

    /** @override */
    onDragMove(pointer)
    {
        const inputController = this._inputController;
        const targetSource = inputController.getActiveTargetSource();
        const targetType = inputController.getActiveTargetType();

        if (targetType === EVENT_SOURCE_EDGE)
        {
            targetSource.setQuadraticByCoords(pointer.x, pointer.y);
        }
        else if (targetType === EVENT_SOURCE_FORWARD_ENDPOINT)
        {
            this.handleDragMoveForEndpoint(targetSource, targetType, pointer, inputController);
        }
    }

    handleDragMoveForEndpoint(targetSource, targetType, pointer, inputController)
    {
        const immediateTargetType = inputController.getImmediateTargetType();
        if (immediateTargetType === EVENT_SOURCE_NODE)
        {
            const immediateTargetSource = inputController.getImmediateTargetSource();
            
            // Restore the previously cached edge quadratics
            if (targetSource.getEdgeTo() === this._cachedEdgeTo)
            {
                targetSource.setQuadraticRadians(this._cachedEdgeQuads.radians);
                targetSource.setQuadraticLength(this._cachedEdgeQuads.length);
            }
            // Angle the self-loop edge towards the pointer
            else if (targetSource.getEdgeFrom() === immediateTargetSource)
            {
                const from = targetSource.getEdgeFrom();
                const dx = from.x - pointer.x;
                const dy = from.y - pointer.y;
                const radians = Math.PI + Math.atan2(dy, dx);
                targetSource.setQuadraticRadians(radians);
                targetSource.setEdgeTo(immediateTargetSource);
            }
            else
            {
                targetSource.setQuadraticRadians(0);
                targetSource.setQuadraticLength(0);
                targetSource.setEdgeTo(immediateTargetSource);
            }
        }
        else
        {
            this._cachedPointer.x = lerp(this._cachedPointer.x, pointer.x, EDGE_POSITION_INTERPOLATION_DELTA);
            this._cachedPointer.y = lerp(this._cachedPointer.y, pointer.y, EDGE_POSITION_INTERPOLATION_DELTA);

            if (targetSource.getEdgeTo() !== this._cachedPointer)
            {
                targetSource.setQuadraticRadians(0);
                targetSource.setQuadraticLength(0);

                targetSource.setEdgeTo(this._cachedPointer);
            }
        }
    }

    /** @override */
    onDragStop(pointer)
    {
        const inputController = this._inputController;
        const targetSource = inputController.getActiveTargetSource();
        const targetType = inputController.getActiveTargetType();
        const isNewEdge = this._newEdge;

        inputController.unbindActiveTarget();
        if (targetType === EVENT_SOURCE_FORWARD_ENDPOINT)
        {
            inputController.setNodeEventsOnly(false);
        }

        const graphController = this._graphController;
        if (inputController.isTrashMode())
        {
            graphController.getGraph().deleteEdge(targetSource);
            graphController.emitGraphEvent(GRAPH_EVENT_EDGE_DELETE, {target: targetSource});
            return;
        }

        if (targetType === EVENT_SOURCE_EDGE)
        {
            graphController.emitGraphEvent(GRAPH_EVENT_EDGE_QUAD_CHANGE, {target: targetSource});
        }
        else
        {
            const edgeTo = targetSource.getEdgeTo();
            if (!edgeTo || edgeTo === this._cachedPointer)
            {
                if (this._shouldDeleteEdgePlaceholder)
                {
                    graphController.getGraph().deleteEdge(targetSource);
                    graphController.emitGraphEvent(GRAPH_EVENT_EDGE_DELETE, {target: targetSource});
                    return;
                }
                else
                {
                    targetSource.setEdgeTo(null);

                    if (isNewEdge)
                    {
                        const labelFormatter = graphController.getLabelFormatter();
                        if (labelFormatter)
                        {
                            targetSource.setEdgeLabel(labelFormatter.getDefaultEdgeLabel());
                        }
                        graphController.emitGraphEvent(GRAPH_EVENT_EDGE_CREATE, {target: targetSource});
                    }
                    else
                    {
                        graphController.emitGraphEvent(GRAPH_EVENT_EDGE_TO_CHANGE, {target: targetSource});
                    }
                }
            }
            else if (edgeTo !== this._cachedEdgeTo)
            {
                const labelFormatter = graphController.getLabelFormatter();
                if (isNewEdge && labelFormatter)
                {
                    targetSource.setEdgeLabel(labelFormatter.getDefaultEdgeLabel());
                }
                graphController.openLabelEditor(targetSource, isNewEdge ? null : targetSource.getEdgeLabel(),
                    (target, value, hasChanged) => 
                    {
                        if (this._shouldDeleteEdgeWithEmptyLabel && !value)
                        {
                            graphController.getGraph().deleteEdge(targetSource);
                            graphController.emitGraphEvent(GRAPH_EVENT_EDGE_DELETE, {target: targetSource});
                        }
                        else if (isNewEdge)
                        {
                            graphController.emitGraphEvent(GRAPH_EVENT_EDGE_CREATE, {target: targetSource});
                        }
                        else if (hasChanged)
                        {
                            graphController.emitGraphEvent(GRAPH_EVENT_EDGE_TO_CHANGE, {target: targetSource});
                        }
                    });
            }
        }
    }
}

export default GraphEdgeInputHandler;