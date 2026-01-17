
import React from 'react';

export interface TextBlockProps {
    content?: string;
    fontSize?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
}

export const TextBlock: React.FC<TextBlockProps> = ({
    content = 'Edit this text...',
    fontSize = '16px',
    color = '#000000',
    textAlign = 'left',
    ...props
}) => {
    const style: React.CSSProperties = {
        fontSize,
        color,
        textAlign,
        margin: 0,
        padding: '8px',
    };

    return (
        <p style={style} {...props}>
            {content}
        </p>
    );
};
