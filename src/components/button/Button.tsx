import React from 'react';

import LoadingSpin from '@/components/LoadingSpin';

interface ButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  customColor?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  className,
  disabled,
  isLoading,
  customColor,
  ...rest
}) => {
  const customTextColor = /(text-\S+(-\d+)?)/.exec(className ?? '')?.[1] ?? '';
  const buttonDisabled = isLoading || disabled;
  const customRounded = /(rounded-\S+(-\w+)?)/.exec(className ?? '')?.[1] ?? '';

  return (
    <button
      onClick={onClick}
      className={`${className} flex items-center justify-center gap-4 px-4 py-2 transition duration-300 shadow-md
      ${!customColor ?"bg-blue-400" : ''}
      ${buttonDisabled ? 'cursor-not-allowed opacity-60' : 'hover:opacity-80'}
      ${!customTextColor ? 'text-on-primary' : ''}
      ${!customRounded ? 'rounded-md' : ''}`}
      disabled={buttonDisabled}
      {...rest}
    >
      {isLoading && <LoadingSpin />}
      {label}
    </button>
  );
};

export default Button;