
import React from 'react';

export interface CardProps {
    title?: string;
    description?: string;
    image?: string;
    accentColor?: string;
}

export const Card: React.FC<CardProps> = ({
    title = 'Feature Card',
    description = 'Add a description to highlight your features.',
    image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop',
    accentColor = 'blue',
}) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300 hover:-translate-y-1">
            {/* Image Area */}
            <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute bottom-0 left-0 h-1 w-full bg-${accentColor}-500 z-20`} />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                    Learn more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
