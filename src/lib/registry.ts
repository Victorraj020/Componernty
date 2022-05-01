
import type { ComponentSchema } from '../types/schema';
import { Container } from '../components/user/Container';
import { Button } from '../components/user/Button';
import { TextBlock } from '../components/user/TextBlock';
import { Hero } from '../components/user/Hero';
import { Card } from '../components/user/Card';
import { Box, Type, MousePointerClick, Image, Layout } from 'lucide-react';

export const COMPONENT_REGISTRY: Record<string, { component: React.FC<any>; schema: ComponentSchema }> = {
    Container: {
        component: Container,
        schema: {
            name: 'Container',
            label: 'Container',
            icon: Box,
            category: 'Layout',
            fields: {
                padding: { type: 'text', label: 'Padding', defaultValue: '20px' },
                backgroundColor: { type: 'color', label: 'Background', defaultValue: 'transparent' },
                display: { type: 'select', label: 'Display', options: ['block', 'flex', 'grid'], defaultValue: 'flex' },
                flexDirection: { type: 'select', label: 'Direction', options: ['row', 'column'], defaultValue: 'column' },
                gap: { type: 'text', label: 'Gap', defaultValue: '10px' },
                alignItems: { type: 'select', label: 'Align Items', options: ['stretch', 'center', 'flex-start', 'flex-end'], defaultValue: 'stretch' },
                minHeight: { type: 'text', label: 'Min Height', defaultValue: '100px' },
            }
        }
    },
    Button: {
        component: Button,
        schema: {
            name: 'Button',
            label: 'Button',
            icon: MousePointerClick,
            category: 'Basic',
            fields: {
                text: { type: 'text', label: 'Label', defaultValue: 'Get Started' },
                variant: { type: 'select', label: 'Variant', options: ['primary', 'secondary', 'outline', 'ghost', 'gradient'], defaultValue: 'primary' },
                size: { type: 'select', label: 'Size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
                fullWidth: { type: 'boolean', label: 'Full Width', defaultValue: false },
            }
        }
    },
    TextBlock: {
        component: TextBlock,
        schema: {
            name: 'TextBlock',
            label: 'Text Block',
            icon: Type,
            category: 'Typography',
            fields: {
                content: { type: 'text', label: 'Content', defaultValue: 'Edit text...' },
                fontSize: { type: 'text', label: 'Size', defaultValue: '16px' },
                color: { type: 'color', label: 'Color', defaultValue: '#000000' },
                textAlign: { type: 'select', label: 'Align', options: ['left', 'center', 'right'], defaultValue: 'left' }
            }
        }
    },
    Hero: {
        component: Hero,
        schema: {
            name: 'Hero',
            label: 'Hero Header',
            icon: Layout,
            category: 'Sections',
            fields: {
                title: { type: 'text', label: 'Title', defaultValue: 'Build Something Amazing' },
                subtitle: { type: 'text', label: 'Subtitle', defaultValue: 'Create stunning websites...' },
                backgroundImage: { type: 'text', label: 'Image URL', defaultValue: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80' },
                align: { type: 'select', label: 'Align', options: ['left', 'center', 'right'], defaultValue: 'center' },
                theme: { type: 'select', label: 'Theme', options: ['light', 'dark'], defaultValue: 'dark' },
            }
        }
    },
    Card: {
        component: Card,
        schema: {
            name: 'Card',
            label: 'Feature Card',
            icon: Image,
            category: 'Basic',
            fields: {
                title: { type: 'text', label: 'Title', defaultValue: 'Feature Card' },
                description: { type: 'text', label: 'Description', defaultValue: 'Add description...' },
                image: { type: 'text', label: 'Image URL', defaultValue: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop' },
                accentColor: { type: 'select', label: 'Accent', options: ['blue', 'indigo', 'purple', 'pink'], defaultValue: 'blue' },
            }
        }
    }
};

export type ComponentType = keyof typeof COMPONENT_REGISTRY;
