/* eslint mocha */
import assert from 'assert';

import { Builder } from '../Builder.js';
import { intersectDFA } from './IntersectDFA.js';

describe.skip('IntersectDFA', () => {
    it('can intersect empty DFAs', async () => {
        let src1 = new Builder().build();
        let src2 = new Builder().build();
        let dst = Builder.fromIdentity(src1).build();
        await intersectDFA(dst, src1, src2);
        assert(dst.Q.size === 0, 'is still empty.');
    });

    it('can intersect single DFAs', async () => {
        let src1 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q0')
            .build();
        let src2 = new Builder()
            .startState('q1')
            .transition('t0', 'q1', '0', 'q1')
            .build();
        let dst = Builder.fromIdentity(src1).build();
        await intersectDFA(dst, src1, src2);
    });

    it('cannot intersect mismatched alphabet DFAs', async () => {
        let src1 = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q0')
            .finalState('q0')
            .build();
        let src2 = new Builder()
            .startState('q1')
            .transition('t0', 'q1', '1', 'q1')
            .finalState('q1')
            .build();
        let dst = Builder.fromIdentity(src1).build();
        try {
            await intersectDFA(dst, src1, src2);
            assert(false, 'Did not throw!');
        } catch (e) {
            // Should throw!
            assert(true, 'expected error for mismatched alphabet.');
        }
    });
});
