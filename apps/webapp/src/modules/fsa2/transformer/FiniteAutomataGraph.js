import FSAEdge, { SYMBOL_SEPARATOR } from '../graph/element/FSAEdge';
import FSANode from '../graph/element/FSANode';
import { Builder, Events } from '@flapjs/module-fa';

/**
 * @typedef {import('../graph/FSAGraphController').default} GraphController
 * @typedef {import('../graph/FSAGraph').default} Graph
 * @typedef {import('../graph/element/FSAEdge').default} Edge
 * @typedef {import('../graph/element/FSANode').default} Node
 */

/**
 * @typedef EdgeKey
 * @property {FSAEdge} target
 * @property {number} index
 * 
 * @typedef {import('@flapjs/module-fa').State<FSANode>} State
 * @typedef {import('@flapjs/module-fa').Symbol<string>} Symbol
 * @typedef {import('@flapjs/module-fa').Transition<EdgeKey>} Transition
 */

/**
 * @param {GraphController} graphController
 */
export function graphToNFA(graphController) {
    let graph = /** @type {Graph} */ (graphController.getGraph());
    /** @type {Builder<GraphController, FSANode, string, EdgeKey>} */
    let builder = new Builder(graphEventHandler, graphController)
        .startState(graph.getStartNode())
        .epsilon('ε');
    // Nodes
    for(let node of graph.getNodes()) {
        builder.state(node);
        if (node.getNodeAccept()) {
            builder.finalState(node);
        }
    }
    // Edges
    for(let edge of graph.getEdges()) {
        let from = edge.getEdgeFrom();
        let to = edge.getEdgeTo();
        let symbols = edge.getEdgeLabel()
            .split(SYMBOL_SEPARATOR)
            .map(s => s.toLowerCase().trim());
        let i = 0;
        for(let s of symbols) {
            builder.transition({ target: /** @type {FSAEdge} */ (edge), index: i++ }, from, s, to);
        }
    }
    return builder.build();
}

/**
 * @param {import('@flapjs/module-fa').FiniteAutomataEvent<GraphController>} e 
 */
export function graphEventHandler(e) {
    let graph = /** @type {Graph} */ (e.attachment.getGraph());
    switch(e.type) {
        case Events.StateCreate: {
            let target = /** @type {State} */ (e.target);
            let { derivedFrom } = e.detail;
            target.key = graph.createNode();
            target.key.setNodeLabel(target.name);
        } break;
        case Events.StateDelete: {
            let target = /** @type {State} */ (e.target);
            graph.deleteNode(target.key);
        } break;
        case Events.StateUpdate: {
            let target = /** @type {State} */ (e.target);
            let { start, final } = e.detail;
            if (typeof start !== 'undefined') {
                graph.setStartNode(target.key);
            }
            if (typeof final !== 'undefined') {
                target.key.setNodeAccept(final);
            }
            target.key.setNodeLabel(target.name);
        } break;
        case Events.SymbolCreate: {
            let target = /** @type {Symbol} */ (e.target);
            target.key = target.name;
            // TODO: Not yet implemented.
        } break;
        case Events.SymbolDelete: {
            let target = /** @type {Symbol} */ (e.target);
            // TODO: Not yet implemented.
        } break;
        case Events.SymbolUpdate: {
            let target = /** @type {Symbol} */ (e.target);
            // TODO: Not yet implemented.
        } break;
        case Events.TransitionCreate: {
            let target = /** @type {Transition} */ (e.target);
            let edge = /** @type {FSAEdge} */ (graph.createEdge(target.from.key));
            target.key = { target: edge, index: 0 };
            // TODO: Does not respect index :(
            if (target.read) {
                edge.setEdgeLabel(target.read.key);
            }
            if (target.to) {
                edge.setEdgeTo(target.to.key);
            }
        } break;
        case Events.TransitionDelete: {
            let target = /** @type {Transition} */ (e.target);
            let { target: edge, index } = target.key;
            // TODO: Does not respect index :(
            graph.deleteEdge(edge);
        } break;
        case Events.TransitionUpdate: {
            let target = /** @type {Transition} */ (e.target);
            let { target: edge, index } = target.key;
            // TODO: Does not respect index :(
            if (target.from) {
                edge.setEdgeFrom(target.from.key);
            }
            if (target.read) {
                edge.setEdgeLabel(target.read.key);
            }
            if (target.to) {
                edge.setEdgeTo(target.to.key);
            }
        } break;
        case 'readClosure':
            // TODO: Ignored.
            break;
        default:
            throw new Error('Unsupported operation.');
    }
}
