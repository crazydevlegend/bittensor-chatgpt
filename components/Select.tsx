// Select.tsx
import React from 'react';

type DefaultOptionType = {
  label: string;
  value: string;
};

interface SelectProps<T = DefaultOptionType> {
  options: T[];
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
  className?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  [x: string]: any; // This allows for any additional props.
}

export const Select = <T extends DefaultOptionType>({
  options,
  getOptionLabel = (option: T) => option.label,
  getOptionValue = (option: T) => option.value,
  className,
  ...props
}: SelectProps<T>) => {
  const defaultClass =
    'w-full flex-1 rounded-md border border-neutral-600 bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3 text-white';

  return (
    <select {...props} className={`${defaultClass} ${className}`}>
      {options.map((option) => (
        <option key={getOptionValue(option)} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
};
