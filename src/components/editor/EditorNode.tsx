
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { COMPONENT_REGISTRY } from '../../lib/registry';
import type { PageNode } from '../../types/editor';
import { useEditorStore } from '../../lib/store';

interface EditorNodeProps {
    node: PageNode;
}

export const EditorNode: React.FC<EditorNodeProps> = ({ node }) => {
    const { selectNode, selectedNodeId } = useEditorStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: node.id,
        data: {
            type: node.type,
            nodeData: node,
        }
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
        position: 'relative', // For selection outline
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(node.id);
    };

    const Component = COMPONENT_REGISTRY[node.type]?.component;

    if (!Component) return <div>Unknown component: {node.type}</div>;

    const isSelected = selectedNodeId === node.id;

    // Render children if any
    const childrenContent = node.children && node.children.length > 0 ? (
        <SortableContext
            items={node.children.map(c => c.id)}
            strategy={verticalListSortingStrategy}
        >
            {node.children.map(child => (
                <EditorNode key={child.id} node={child} />
            ))}
        </SortableContext>
    ) : null;

    // We pass `childrenContent` to the component
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={`relative group ${isSelected ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-blue-300'}`}
        >
            <Component {...node.props}>
                {childrenContent}
                {/* Visual placeholder if empty container? */}
                {node.type === 'Container' && node.children.length === 0 && (
                    <div className="p-4 text-center text-gray-300 border-2 border-dashed border-gray-200 rounded min-h-[50px]">
                        Drop items here
                    </div>
                )}
            </Component>

            {/* Label on hover/selection */}
            {isSelected && (
                <div className="absolute -top-5 left-0 bg-blue-500 text-white text-xs px-1 rounded-t">
                    {node.type}
                </div>
            )}
        </div>
    );
};
