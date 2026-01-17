
import type { LucideIcon } from 'lucide-react';

export type FieldType = 'text' | 'color' | 'number' | 'select' | 'boolean' | 'image';


export interface ComponentSchema {
    name: string;        // Unique internal ID (e.g. 'HeroSection')
    label: string;       // Display name (e.g. 'Hero Section')
    icon?: LucideIcon;
    category?: string;
    fields: {
        [propName: string]: {
            type: FieldType;
            label: string;
            defaultValue?: any;
            options?: string[]; // For 'select' type
            placeholder?: string;
        };
    };
}
