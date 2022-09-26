import { useCallback, useState } from 'react';

export function useForceUpdate() {
    const [_, update] = useState(0);
    return useCallback(function forceUpdate() {
        update(performance.now());
    }, [update]);
}
