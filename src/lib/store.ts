
import { create } from 'zustand';
import type { PageNode, ProjectState } from '../types/editor';
import { v4 as uuidv4 } from 'uuid';

interface EditorStore extends ProjectState {
    // Actions
    selectNode: (id: string | null) => void;
    addNode: (parentId: string, type: string, index?: number) => void;
    updateNodeProps: (id: string, newProps: Record<string, any>) => void;
    moveNode: (activeId: string, overId: string) => void; // Placeholder for now
    deleteNode: (id: string) => void;
    setPage: (page: PageNode) => void;
}

const initialPage: PageNode = {
    id: 'root',
    type: 'Container',
    props: {
        padding: '2rem',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    children: [],
};

export const useEditorStore = create<EditorStore>((set) => ({
    page: initialPage,
    selectedNodeId: null,

    selectNode: (id) => set({ selectedNodeId: id }),

    setPage: (page) => set({ page }),

    addNode: (parentId, type, index) => set((state) => {
        const newNode: PageNode = {
            id: uuidv4(),
            type,
            props: {}, // Initialize with defaults from schema later?
            children: [],
        };

        if (parentId === 'root') {
            // Simple case for root additions
            const newChildren = [...state.page.children];
            if (typeof index === 'number') {
                newChildren.splice(index, 0, newNode);
            } else {
                newChildren.push(newNode);
            }
            return { page: { ...state.page, children: newChildren } };
        }

        // Recursive helper to find and update parent
        const updateChildren = (nodes: PageNode[]): PageNode[] => {
            return nodes.map((node) => {
                if (node.id === parentId) {
                    const newChildren = [...node.children];
                    if (typeof index === 'number') {
                        newChildren.splice(index, 0, newNode);
                    } else {
                        newChildren.push(newNode);
                    }
                    return { ...node, children: newChildren };
                }
                if (node.children.length > 0) {
                    return { ...node, children: updateChildren(node.children) };
                }
                return node;
            });
        };

        return {
            page: {
                ...state.page,
                children: updateChildren(state.page.children),
            },
            selectedNodeId: newNode.id, // Auto-select new node
        };
    }),

    updateNodeProps: (id, newProps) => set((state) => {
        if (id === 'root') {
            return { page: { ...state.page, props: { ...state.page.props, ...newProps } } };
        }

        const updateNode = (nodes: PageNode[]): PageNode[] => {
            return nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, props: { ...node.props, ...newProps } };
                }
                if (node.children.length > 0) {
                    return { ...node, children: updateNode(node.children) };
                }
                return node;
            });
        };

        return {
            page: {
                ...state.page,
                children: updateNode(state.page.children),
            },
        };
    }),

    deleteNode: (id) => set((state) => {
        if (id === 'root') return state; // Cannot delete root

        const deleteFromChildren = (nodes: PageNode[]): PageNode[] => {
            return nodes.filter(node => node.id !== id).map(node => ({
                ...node,
                children: deleteFromChildren(node.children)
            }));
        };

        return {
            page: {
                ...state.page,
                children: deleteFromChildren(state.page.children)
            },
            selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
        };
    }),

    moveNode: (activeId, overId) => {
        // Complex logic for tree movement - implementing basic reordering later
        console.log('Move node not fully implemented yet in store', activeId, overId);
    }
}));
