
import React from 'react';

export interface ContainerProps {
    children?: React.ReactNode;
    padding?: string;
    backgroundColor?: string;
    display?: 'block' | 'flex' | 'grid';
    flexDirection?: 'row' | 'column';
    gap?: string;
    alignItems?: string;
    justifyContent?: string;
    minHeight?: string;
}

export const Container: React.FC<ContainerProps> = ({
    children,
    padding = '20px',
    backgroundColor = 'transparent',
    display = 'block',
    flexDirection = 'column',
    gap = '0px',
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    minHeight = 'auto',
    ...props
}) => {
    const style: React.CSSProperties = {
        padding,
        backgroundColor,
        display,
        flexDirection,
        gap,
        alignItems,
        justifyContent,
        minHeight,
        // Add default border to make it visible if empty? 
        // Maybe better handled by the editor wrapper
        boxSizing: 'border-box',
        width: '100%',
    };

    return (
        <div style={style} {...props}>
            {children}
        </div>
    );
};
