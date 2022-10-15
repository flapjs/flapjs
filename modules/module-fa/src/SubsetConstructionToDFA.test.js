/* eslint mocha */

import assert from 'assert';
import { Builder } from './Builder.js';
import { findStateByName, findSymbolByName, readTransitionFrom } from './Helper.js';
import { subsetConstructionToDFA } from './SubsetConstructionToDFA.js';
import { assertDFAAccepts, assertDFARejects } from './TestHelper.js';

describe('SubsetConstructionToDFA', () => {
    it('can convert empty NFA', async () => {
        let src = new Builder().build();
        let dst = Builder.fromIdentity(src).build();
        await subsetConstructionToDFA(dst, src);

        await assertDFARejects('', dst);
    });

    it('can convert simple NFA', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q0')
            .transition('t1', 'q0', '1', 'q1')
            .build();
        let dst = Builder.fromIdentity(src).build();
        await subsetConstructionToDFA(dst, src);

        assert(dst.Q.size === 3, 'has 3 states.');
        assert(findStateByName(dst, '{}'), 'trap state exists.');
        assert(findStateByName(dst, '{q0}'), 'q0 set exists.');
        assert(findStateByName(dst, '{q1}'), 'q1 set exists.');
        assert(dst.s === findStateByName(dst, '{q0}'), 'start state is expected.');

        assert(dst.A.size === 2, 'has 2 symbols.');
        assert(findSymbolByName(dst, '0'), 'symbol 0 exists.');
        assert(findSymbolByName(dst, '1'), 'symbol 1 exists.');

        assert(dst.T.size === 6, 'has 6 transitions.');
        let q0 = findStateByName(dst, '{q0}');
        let a0 = findSymbolByName(dst, '0');
        let out = new Set();
        readTransitionFrom(out, dst, q0, a0);
        assert(out.size === 1, 'can perform 0 read from {q0}.');
        out.clear();

        let a1 = findSymbolByName(dst, '1');
        readTransitionFrom(out, dst, q0, a1);
        assert(out.size === 1, 'can perform 1 read from {q0}.');
        out.clear();
    });
    
    it('can convert recursive NFA', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '1', 'q1')
            .transition('t1', 'q1', '0', 'q0')
            .finalState('q0')
            .build();
        let dst = Builder.fromIdentity(src).build();
        await subsetConstructionToDFA(dst, src);
    });

    it('can convert for *1', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q0')
            .transition('t1', 'q0', '1', 'q0')
            .transition('t2', 'q0', '1', 'q1')
            .finalState('q1')
            .build();
        let dst = Builder.fromIdentity(src).build();
        await subsetConstructionToDFA(dst, src);

        await assertDFARejects('', dst);
        await assertDFARejects('0', dst);
        await assertDFAAccepts('1', dst);
        await assertDFAAccepts('111111111111', dst);
        await assertDFAAccepts('10000000001', dst);
        await assertDFAAccepts('0000000001', dst);
        await assertDFAAccepts('101010010010100101', dst);
        await assertDFARejects('11111110', dst);
    });

    it ('can convert NFA with EPSILON', async () => {
        let src = new Builder()
            .startState('q0')
            .epsilon('E')
            .transition('t0', 'q0', '0', 'q0')
            .transition('t1', 'q0', '1', 'q0')
            .transition('t2', 'q0', '1', 'q1')
            .transition('t3', 'q0', 'E', 'q1')
            .finalState('q1')
            .build();
        let dst = Builder.fromIdentity(src).build();
        await subsetConstructionToDFA(dst, src);

        await assertDFAAccepts('', dst);
        await assertDFAAccepts('0', dst);
        await assertDFAAccepts('1', dst);
        await assertDFAAccepts('111111111111', dst);
        await assertDFAAccepts('10000000001', dst);
        await assertDFAAccepts('0000000001', dst);
        await assertDFAAccepts('101010010010100101', dst);
    });
});
