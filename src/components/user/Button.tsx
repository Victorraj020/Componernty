

export interface ButtonProps {
    text?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string; // For editor overrides if needed
}

export const Button: React.FC<ButtonProps> = ({
    text = 'Get Started',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200/50 hover:shadow-xl",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border-2 border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50",
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:brightness-110",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-8 text-sm tracking-wide",
        lg: "h-14 px-10 text-base",
    };

    return (
        <button
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${className || ''}
      `}
            {...props}
        >
            {text}
        </button>
    );
};
