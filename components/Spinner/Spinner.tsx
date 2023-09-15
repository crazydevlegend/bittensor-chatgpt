import { FC } from 'react';

import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

const Spinner = ({ className }: Props) => {
  return (
    <div
      className={twMerge(
        'h-4 w-4 box-border animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100',
        className,
      )}
    ></div>
  );
};

export default Spinner;
