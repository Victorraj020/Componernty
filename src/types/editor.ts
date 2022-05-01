
export interface PageNode {
    id: string;
    type: string; // Maps to ComponentSchema.name
    props: Record<string, any>;
    children: PageNode[];
}

export interface PageMetadata {
    title: string;
    description: string;
}

export interface ProjectState {
    page: PageNode;
    selectedNodeId: string | null;
}
