/* eslint mocha */
import assert from 'assert';

import { Builder } from './Builder.js';
import { equivalenceDFA } from './EquivalenceDFA.js';

describe.skip('EquivalenceDFA', () => {
    it('can compare empty DFAs', async () => {
        let src1 = new Builder().build();
        let src2 = new Builder().build();
        assert(await equivalenceDFA(src1, src2), 'empty DFAs are equal.');
    });

    it('can compare itself', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q1')
            .finalState('q1');
        assert(await equivalenceDFA(src, src), 'self is equal.');
    });

    it('can compare DFAs', async () => {
        let src1 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q1')
            .finalState('q1')
            .build();
        let src2 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q1')
            .finalState('q1')
            .build();
        let src3 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '1', 'q1')
            .finalState('q1')
            .build();
        
        assert(await equivalenceDFA(src1, src2), 'is equal for same DFA.');
        assert(await equivalenceDFA(src2, src3), 'is not equal for different read symbols.');
    });

    it('can compare minimized DFAs', async () => {
        let src1 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q3')
            .transition('t1', 'q0', '1', 'q4')
            .transition('t2', 'q1', '0', 'q4')
            .transition('t3', 'q1', '1', 'q5')
            .transition('t4', 'q2', '0', 'q5')
            .transition('t5', 'q2', '1', 'q3')
            .transition('t6', 'q3', '0', 'q0')
            .transition('t7', 'q3', '1', 'q2')
            .transition('t8', 'q4', '0', 'q1')
            .transition('t9', 'q4', '1', 'q0')
            .transition('t10', 'q5', '0', 'q2')
            .transition('t11', 'q5', '1', 'q1')
            .finalState('q0')
            .finalState('q3')
            .build();
        let min1 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q0')
            .transition('t1', 'q0', '1', 'q1')
            .transition('t2', 'q1', '1', 'q0')
            .transition('t3', 'q1', '0', 'q2')
            .transition('t4', 'q2', '0', 'q1')
            .transition('t5', 'q2', '1', 'q2')
            .finalState('q0')
            .finalState('q0')
            .build();
        assert(await equivalenceDFA(src1, min1), 'is equal for minimized.');

        let src2 = new Builder()
            .startState('q0')
            .epsilon('E')
            .transition('t0', 'q0', 'a', 'q1')
            .transition('t1', 'q1', 'E', 'q2')
            .transition('t2', 'q2', 'b', 'q3')
            .transition('t3', 'q3', 'E', 'q4')
            .transition('t4', 'q4', 'c', 'q5')
            .finalState('q5')
            .build();
        let min2 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', 'a', 'q1')
            .transition('t1', 'q1', 'b', 'q2')
            .transition('t2', 'q2', 'c', 'q3')
            .finalState('q3')
            .build();
        assert(await equivalenceDFA(src2, min2), 'is equal for minimized by removing EPSILON.')

        let src3 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q1')
            .transition('t0', 'q0', '1', 'q1')
            .transition('t0', 'q1', '0', 'q1')
            .transition('t0', 'q1', '1', 'q1')
            .finalState('q1')
            .build();
        // TODO: test isLanguageNotEmpty()?
    });
});