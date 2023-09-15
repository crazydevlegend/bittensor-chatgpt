interface RadioButtonProps {
  label: string; // Label text for the radio button
  id: string; // Unique ID for the radio button (should match with htmlFor in the label)
  name: string; // Name attribute (to group radio buttons)
  value: string; // Value attribute
  checked: boolean; // If the radio button is currently checked
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change event handler
  disabled?: boolean; // Optional: If the radio button is disabled
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  id,
  name,
  value,
  checked,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
      >
        {label}
      </label>
    </div>
  );
};
