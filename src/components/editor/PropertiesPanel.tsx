import React from 'react';
import { useEditorStore } from '../../lib/store';
import { COMPONENT_REGISTRY } from '../../lib/registry';
import { Settings, Trash2 } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
    const { page, selectedNodeId, updateNodeProps, deleteNode } = useEditorStore();

    const findNode = (nodes: any[], id: string): any | null => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNode(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedNode = selectedNodeId === 'root' ? page : findNode(page.children, selectedNodeId || '');

    if (!selectedNode) {
        return (
            <div className="w-80 border-l border-gray-200 bg-white h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                <Settings size={48} className="mb-4 text-gray-200" />
                <p>Select an element to edit</p>
            </div>
        );
    }

    const componentType = selectedNode.type;
    const schema = COMPONENT_REGISTRY[componentType]?.schema;

    if (!schema) return null;

    return (
        <div className="w-80 border-l border-gray-200 bg-white h-full flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50/50">
                <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-0.5">
                        {componentType}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                        #{selectedNode.id.slice(0, 8)}
                    </span>
                </div>
                {selectedNodeId !== 'root' && (
                    <button
                        onClick={() => deleteNode(selectedNode.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete Element"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            {/* Tabs - Keeping it simple for now, but infrastructure is here */}
            {/* <div className="flex border-b border-gray-200 bg-gray-50/30">
                <button className="flex-1 py-2 text-xs font-medium text-gray-700 bg-white border-b border-transparent">Properties</button>
            </div> */}

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Group fields by conceptual type based on names, simplistic for MVP */}
                <div className="space-y-4">
                    {Object.entries(schema.fields).map(([name, field]) => {
                        const currentValue = selectedNode.props[name] ?? field.defaultValue;
                        return (
                            <div key={name} className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                                    {field.label || name}
                                </label>
                                <PropertyInput
                                    type={field.type}
                                    value={currentValue}
                                    options={field.options}
                                    onChange={(val) => updateNodeProps(selectedNode.id, { [name]: val })}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const PropertyInput: React.FC<{ type: string; value: any; options?: string[]; onChange: (val: any) => void }> = ({ type, value, options, onChange }) => {
    if (type === 'select' && options) {
        return (
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>
        );
    }

    if (type === 'color') {
        return (
            <div className="flex gap-2">
                <div className="relativew-8 h-8 rounded border border-gray-200 overflow-hidden shrink-0">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-8 h-8 p-0 border-0 absolute -top-1 -left-1 w-[150%] h-[150%] cursor-pointer"
                    />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                />
            </div>
        );
    }

    return (
        <input
            type={type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow placeholder:text-gray-300"
        />
    );
};
