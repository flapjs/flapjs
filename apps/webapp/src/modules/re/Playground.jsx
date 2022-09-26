import React from 'react';

import ExpressionView from './components/views/ExpressionView';

export function Playground({ app, module }) {
    return (
        <ExpressionView session={app.getSession()} />
    );
}
