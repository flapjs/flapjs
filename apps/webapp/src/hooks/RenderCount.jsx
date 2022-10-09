import React, { useEffect, useRef } from 'react';

export function RenderCount(props) {
    const count = useRef(1);
    useEffect(() => {
        count.current += 1;
    });
    return (
        <div>
            {props.name || ''} renders: {count.current}
        </div>
    )
}
