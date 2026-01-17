# Visual Website Builder Architecture & Design

## 1. High-Level Architecture
The application is divided into three distinct layers to ensure modularity and separation of concerns:

1.  **The Registry (Component Library)**
    *   A central definitions file that registers available React components.
    *   Contains both the **component implementation** (the React code) and the **component schema** (metadata describing props, types, and default values).
    *   *Analogy*: This is the "palette" of paints available to the user.

2.  **The Editor (Builder Core)**
    *   **State Management**: Holds the current page layout tree (JSON).
    *   **Canvas**: A drop zone that recursively renders the page tree. It wraps components in "Editor Wrappers" that handle selection, hovering, and drag-and-drop mechanics.
    *   **Properties Panel**: A dynamic form generator that reads the selected component's schema and renders appropriate inputs (text fields, color pickers, sliders) to update the JSON node.

3.  **The Runtime (Renderer & Exporter)**
    *   **Renderer**: A pure function component that takes the JSON tree and renders the actual React components *without* the editor wrappers. Used for "Preview" mode.
    *   **Exporter**: A utility that traverses the JSON tree and generates valid React + TypeScript source code string, producing a standalone file that the user can download.

## 2. Folder Structure
```
src/
├── components/
│   ├── editor/          # Editor-specific UI (Toolbar, Sidebar, PropertiesPanel)
│   ├── user/            # User-facing draggable components (Button, Hero, Card)
│   └── ui/              # Internal UI components (Inputs, Dialogs)
├── lib/
│   ├── dnd/             # Drag and drop utilities
│   ├── registry.ts      # Component registration & schema definitions
│   ├── generator.ts     # Code generation logic (JSON -> TSX string)
│   └── store.ts         # Global state (Zustand)
├── types/
│   ├── editor.ts        # Type definitions for the editor
│   └── schema.ts        # Type definitions for component schemas
├── App.tsx              # Main layout
└── main.tsx             # Entry point
```

## 3. Component Schema Design
Every component must define a schema so the editor knows how to interact with it.

```typescript
// types/schema.ts
export type FieldType = 'text' | 'color' | 'number' | 'select' | 'boolean';

export interface ComponentSchema {
  name: string;        // Internal unique ID needed for code gen (e.g., 'HeroSection')
  label: string;       // Display name (e.g., 'Hero Section')
  fields: {
    [propName: string]: {
      type: FieldType;
      label: string;
      defaultValue?: any;
      options?: string[]; // For 'select' type
    };
  };
}
```

## 4. JSON Page Schema (The "Save File")
The page is a tree of nodes.

```typescript
// Example JSON state
const page = {
  id: "root",
  type: "Container", // Root container
  props: { padding: "20px" },
  children: [
    {
      id: "node-1",
      type: "HeroSection",
      props: {
        title: "Welcome to My Site",
        subtitle: "Built with React Builder",
        backgroundColor: "#f0f0f0"
      },
      children: []
    },
    {
      id: "node-2",
      type: "CardGrid",
      props: { columns: 3 },
      children: [
        { id: "node-3", type: "Card", props: { title: "Feature 1" } },
        { id: "node-4", type: "Card", props: { title: "Feature 2" } }
      ]
    }
  ]
};
```

## 5. Drag-and-Drop Logic
We use `@dnd-kit/core` for the physics and event handling.
- **Draggables**: The items in the "Component Library" sidebar.
- **Droppables**: The Canvas area and any "Container" components already on the canvas.
- **Sortables**: The components already placed on the canvas (allows reordering).

**Flow:**
1.  User starts dragging a Sidebar Item.
2.  `DragOverlay` appears showing a ghost of the component.
3.  User hovers over the Canvas using `PointerSensor`.
4.  `onDragOver` detects the target container.
5.  `onDragEnd` calculates the new index and inserts a new Node into the JSON tree at that position.

## 6. Renderer Logic (JSON -> React)
The renderer recursively maps the JSON nodes to the React components found in the `Registry`.

```tsx
const renderNode = (node: PageNode) => {
  const Component = Registry[node.type].component;
  
  return (
    <Component key={node.id} {...node.props}>
      {node.children?.map(child => renderNode(child))}
    </Component>
  );
};
```

## 7. Export Logic (JSON -> Code)
The exporter reconstructs the code string.

```typescript
export const generateCode = (node: PageNode): string => {
  const imports = new Set<string>();
  
  const generateComponent = (n: PageNode): string => {
    imports.add(n.type); // Collect import
    const props = Object.entries(n.props)
      .map(([k, v]) => `${k}="${v}"`) // Simplified prop formatting
      .join(" ");
      
    // Self-closing if no children
    if (!n.children || n.children.length === 0) {
      return `<${n.type} ${props} />`;
    }
    
    return `<${n.type} ${props}>
      ${n.children.map(generateComponent).join('\n')}
    </${n.type}>`;
  };

  const jsx = generateComponent(node);
  
  return `
import React from 'react';
import { ${Array.from(imports).join(', ')} } from './components';

export default function MyPage() {
  return (
    <div className="min-h-screen">
      ${jsx}
    </div>
  );
}
  `;
};
```
