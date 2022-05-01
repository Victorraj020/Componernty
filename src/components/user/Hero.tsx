
import React from 'react';
import { Button } from './Button';

export interface HeroProps {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    align?: 'left' | 'center' | 'right';
    theme?: 'light' | 'dark';
}

export const Hero: React.FC<HeroProps> = ({
    title = 'Build Something Amazing',
    subtitle = 'Create stunning websites in minutes with our visual editor.',
    backgroundImage = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80',
    align = 'center',
    theme = 'dark',
}) => {
    const isDark = theme === 'dark';

    return (
        <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden w-full group">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundImage}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                    alt="Hero"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-black/50' : 'bg-white/30'} backdrop-blur-[2px]`} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
            </div>

            {/* Content */}
            <div className={`relative z-10 container mx-auto px-6 max-w-5xl text-${align}`}>
                <div className={`space-y-6 ${align === 'center' ? 'mx-auto' : ''} max-w-3xl`}>
                    <h1 className={`text-5xl md:text-7xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900 drop-shadow-sm'}`}>
                        {title}
                    </h1>
                    <p className={`text-lg md:text-2xl font-light ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {subtitle}
                    </p>
                    <div className={`flex gap-4 pt-4 ${align === 'center' ? 'justify-center' : ''}`}>
                        <Button variant={isDark ? "gradient" : "primary"} size="lg" text="Get Started" />
                        <Button variant={isDark ? "outline" : "secondary"} size="lg" text="Learn More" className={isDark ? "text-white border-white/30 hover:bg-white/10" : ""} />
                    </div>
                </div>
            </div>
        </div>
    );
};
