import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { COMPONENT_REGISTRY } from '../../lib/registry';
import { Search, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'blocks' | 'settings'>('blocks');

    // Group components by category
    const components = Object.values(COMPONENT_REGISTRY);
    const filtered = components.filter(c =>
        c.schema.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = Array.from(new Set(filtered.map(c => c.schema.category || 'Other')));

    return (
        <div className="w-80 border-r border-gray-200 bg-white h-full flex flex-col flex-shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('blocks')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'blocks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Blocks
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Settings
                </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'blocks' ? (
                    <div className="space-y-6">
                        {categories.map(category => (
                            <div key={category}>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{category}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {filtered
                                        .filter(c => (c.schema.category || 'Other') === category)
                                        .map(({ schema }) => (
                                            <DraggableItem key={schema.name} name={schema.name} label={schema.label} icon={schema.icon} />
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8 text-sm">
                        Global settings coming soon
                    </div>
                )}
            </div>
        </div>
    );
};

const DraggableItem: React.FC<{ name: string; label: string; icon?: React.ElementType }> = ({ name, label, icon: Icon }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${name}`,
        data: {
            type: name,
            isSidebarItem: true,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md cursor-grab active:cursor-grabbing bg-white transition-all group select-none touch-none"
        >
            <div className="p-2 bg-gray-50 rounded-md group-hover:bg-blue-50 transition-colors">
                {Icon ? <Icon size={20} className="text-gray-600 group-hover:text-blue-600" /> : <Settings size={20} />}
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
        </div>
    );
};
