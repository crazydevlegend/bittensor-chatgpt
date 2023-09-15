export const Input = ({
  placeholder,
  value,
  onChange,
  type,
}: JSX.IntrinsicElements['input']) => {
  return (
    <input
      className="w-full flex-1 rounded-md border border-neutral-600 bg-[#202123] px-4 py-3 pr-10 text-[14px] leading-3 text-white"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
