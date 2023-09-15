import { MouseEventHandler } from 'react';

import { twMerge } from 'tailwind-merge';

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
}

const Button = ({ onClick, children, className }: Props) => {
  return (
    <button
      className={twMerge(
        'flex flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
