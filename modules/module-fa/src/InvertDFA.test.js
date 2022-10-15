import assert from 'assert';

import { Builder } from './Builder.js';
import { findStateByName } from './Helper.js';
import { invertDFA } from './InvertDFA.js';

describe('InvertDFA', () => {
    it('can invert empty DFA', async () => {
        let src = new Builder().build();
        let dst = Builder.fromIdentity(src).build();
        await invertDFA(dst, src);

        assert(dst.Q.size === 0, 'is empty.');
    });
    
    it('can invert a single state', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q0')
            .build();
        let dst = Builder.fromIdentity(src).build();
        await invertDFA(dst, src);

        assert(findStateByName(dst, 'q0'), 'single state exists.');
        let q0 = findStateByName(dst, 'q0');
        assert(dst.F.has(q0), 'single state inverted.');
    });

    it('can invert simple DFA', async () => {
        let src = new Builder()
            .startState('q0')
            .transition('t0', 'q0', '0', 'q0')
            .transition('t0', 'q0', '1', 'q0')
            .transition('t0', 'q1', '0', 'q0')
            .transition('t0', 'q1', '1', 'q0')
            .finalState('q0')
            .build();
        let dst = Builder.fromIdentity(src).build();
        await invertDFA(dst, src);

        let q0 = findStateByName(dst, 'q0');
        let q1 = findStateByName(dst, 'q1');

        assert(q0, 'q0 exists.');
        assert(q1, 'q1 exists.');

        assert(!dst.F.has(q0), 'q0 no longer final.');
        assert(dst.F.has(q1), 'q1 is now final.');
    })
});
