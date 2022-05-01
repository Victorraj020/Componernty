
import type { PageNode } from '../types/editor';

export const generateCode = (node: PageNode): string => {
    const imports = new Set<string>();

    // Helper to resolve component name if it's 'root' (which maps to Container)
    const getComponentName = (type: string) => type === 'root' ? 'Container' : type;

    const generateComponent = (n: PageNode, indent: number = 0): string => {
        const type = getComponentName(n.type);
        imports.add(type);

        // Format props
        const propsStr = Object.entries(n.props)
            .map(([k, v]) => {
                if (k === 'children') return ''; // Skip children prop
                if (typeof v === 'string') return `${k}="${v}"`;
                if (typeof v === 'number' || typeof v === 'boolean') return `${k}={${v}}`;
                return `${k}={${JSON.stringify(v)}}`;
            })
            .filter(s => s !== '')
            .join(' ');

        const spaces = ' '.repeat(indent);

        if (!n.children || n.children.length === 0) {
            return `${spaces}<${type} ${propsStr} />`;
        }

        return `${spaces}<${type} ${propsStr}>\n` +
            `${n.children.map(c => generateComponent(c, indent + 2)).join('\n')}\n` +
            `${spaces}</${type}>`;
    };

    const jsx = generateComponent(node, 6);

    const importsList = Array.from(imports)
        .filter(name => name !== 'root') // Filter out internal names if any
        .map(name => `import { ${name} } from './components/user/${name}';`)
        .join('\n');

    return `import React from 'react';
${importsList}

export default function GeneratedPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
${jsx}
    </div>
  );
}
`;
};
