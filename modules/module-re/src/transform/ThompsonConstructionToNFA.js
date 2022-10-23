import { dispatchEvent, Events } from '../RegularExpression.js';
import { epsilonClosureFrom, deriveStateFromSet, deriveSetFromState, startTransition, endTransition, readClosureFrom } from '../Helper.js';

/**
 * @typedef {import('./RegularExpression').RegularExpression<?>} RegularExpression
 * @typedef {import('../FiniteAutomata').FiniteAutomata<?>} FiniteAutomata
 */

/**
 * @param {FiniteAutomata} dst 
 * @param {RegularExpression} src 
 * @returns {Promise<FiniteAutomata>}
 */
export async function thompsonConstructionToNFA(dst, src) {
    // Parse into an AST
    // Compute terminals
    // Convert each subtree into a NFA graph
    return dst;
}

/*

1. has 1 start state
2. has 1 final state

Split into subexpressions

DECONSTRUCT each next expression

Rule Sheet
1. Empty Expressions =>
2. Input alphabet =>
3. Union expression =>
4. Concat expression
5. Kleene expression => 
6. Empty transitions connect parens expressions.

Visualizations
https://en.wikipedia.org/wiki/Thompson%27s_construction

Grouped Nodes (labelled)
REgex deconstruction

 */