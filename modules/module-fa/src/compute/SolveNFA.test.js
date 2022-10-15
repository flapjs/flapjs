/* eslint mocha */

import { Builder } from '../Builder.js';
import { assertNFAAccepts, assertNFARejects } from '../TestHelper.js';

describe('SolveNFA', () => {
    it('can solve 1* (same as DFA)', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q1')
            .transition('t1', 'q0', '1', 'q0')
            .transition('t2', 'q1', '0', 'q1')
            .transition('t3', 'q1', '1', 'q1')
            .finalState('q0')
            .build();
        await assertNFAAccepts('', src); // Since start is also final
        await assertNFARejects('0', src);
        await assertNFAAccepts('1', src);
        await assertNFARejects('011111', src);
        await assertNFARejects('11010101', src);
        await assertNFAAccepts('1111', src);
    });

    it('can solve NFA with EPSILON', async () => {
        let src = new Builder()
            .startState('q0')
            .epsilon('E')
            .transition('t0', 'q0', '0', 'q1')
            .transition('t1', 'q0', '1', 'q2')
            .transition('t2', 'q1', 'E', 'q2')
            .transition('t3', 'q1', 'E', 'q0')
            .transition('t4', 'q1', '0', 'q1')
            .transition('t5', 'q1', '1', 'q1')
            .finalState('q2')
            .build();
        await assertNFARejects('', src);
        await assertNFAAccepts('0', src);
        await assertNFAAccepts('1', src);
        await assertNFAAccepts('011111', src);
        await assertNFARejects('11010101', src);
        await assertNFARejects('1111', src);
    });
});
