/* eslint mocha */

import { Builder } from '../Builder.js';
import { assertDFAAccepts, assertDFARejects } from '../TestHelper.js';

describe('SolveDFA', () => {
    it('can solve 1*', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q1')
            .transition('t1', 'q0', '1', 'q0')
            .transition('t2', 'q1', '0', 'q1')
            .transition('t3', 'q1', '1', 'q1')
            .finalState('q0')
            .build();
        await assertDFAAccepts('', src); // Since start is also final
        await assertDFARejects('0', src);
        await assertDFAAccepts('1', src);
        await assertDFARejects('011111', src);
        await assertDFARejects('11010101', src);
        await assertDFAAccepts('1111', src);
    });

    it('can solve Sipser\'s p37#1.1', async () => {
        let src = new Builder()
            .startState('q1')
            .transition('t0', 'q1', 'b', 'q1')
            .transition('t1', 'q1', 'a', 'q2')
            .transition('t2', 'q2', 'a', 'q3')
            .transition('t3', 'q2', 'b', 'q3')
            .transition('t4', 'q3', 'a', 'q2')
            .transition('t5', 'q3', 'b', 'q1')
            .finalState('q2')
            .build();
        await assertDFARejects('bbb', src);
        await assertDFAAccepts('a', src);
        await assertDFARejects('aa', src);
        await assertDFAAccepts('aaa', src);
    });

    it('can solve Sipser\'s p37#1.7', async () => {
        let src = new Builder()
            .startState('q1')
            .transition('t0', 'q1', '0', 'q1')
            .transition('t1', 'q1', '1', 'q2')
            .transition('t2', 'q2', '1', 'q2')
            .transition('t3', 'q2', '0', 'q1')
            .finalState('q2')
            .build();
        await assertDFARejects('0', src);
        await assertDFAAccepts('1', src);
        await assertDFARejects('10', src);
        await assertDFAAccepts('111', src);
    });
});
