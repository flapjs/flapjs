import React from 'react';

declare module "*.module.css" {
    const content: Record<string, string>;
    export default content;
}
declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>;
    export default content;
}

/// <reference types="vite/client" />