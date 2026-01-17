import React, { useState } from 'react';
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent, useDroppable, pointerWithin, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EditorNode } from './EditorNode';
import { useEditorStore } from '../../lib/store';
import { COMPONENT_REGISTRY } from '../../lib/registry';

export const Canvas: React.FC = () => {
    const { page, addNode, selectNode } = useEditorStore();
    const [activeSidebarType, setActiveSidebarType] = useState<string | null>(null);

    const { setNodeRef } = useDroppable({
        id: page.id, // 'root'
        data: { type: 'Container' } // Root is a container
    });

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.isSidebarItem) {
            setActiveSidebarType(active.data.current.type);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveSidebarType(null);

        if (!over) return;

        if (active.data.current?.isSidebarItem) {
            const type = active.data.current.type;
            addNode(over.id as string, type);
        }
    };

    // Calculate dynamic height based on content or screensize for "page-like" feel
    return (
        <div className="flex-1 bg-gray-100/50 p-8 overflow-auto h-full flex justify-center relative touch-none">
            {/* Canvas Background Grid */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            }}></div>

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* The Page Itself */}
                <div
                    ref={setNodeRef}
                    className="w-full max-w-[1024px] bg-white shadow-2xl shadow-gray-200/50 min-h-[85vh] h-max relative z-10 transition-all duration-300 ease-out animate-in fade-in zoom-in-95 group"
                    onClick={() => selectNode(page.id)}
                >
                    {/* Page Title Bar */}
                    <div className="absolute -top-8 left-0 text-xs font-medium text-gray-400 uppercase tracking-widest pointer-events-none">
                        Main Page • 1024px
                    </div>

                    <SortableContext items={page.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        {page.children.map(child => (
                            <EditorNode key={child.id} node={child} />
                        ))}
                    </SortableContext>

                    {page.children.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none border-2 border-dashed border-gray-100 m-4 rounded-xl">
                            <p className="text-xl font-medium text-gray-400">Start Building</p>
                            <p className="text-sm mt-2">Drag blocks from the left sidebar</p>
                        </div>
                    )}
                </div>

                <DragOverlay>
                    {activeSidebarType ? (
                        <div className="p-3 bg-white border border-blue-500 shadow-xl rounded-lg w-40 flex items-center gap-3 opacity-90 backdrop-blur-sm cursor-grabbing ring-2 ring-blue-200">
                            {/* Getting icon dynamically would be nicer but basic text works for ghosts */}
                            <span className="font-medium text-sm text-gray-700">{COMPONENT_REGISTRY[activeSidebarType]?.schema.label}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
