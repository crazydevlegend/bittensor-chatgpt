interface Props {
  onClick?: () => void;
  children: React.ReactNode;
}

const DropdownButton = ({ onClick, children }: Props) => {
  return (
    <button
      className="flex-grow rounded flex py-4 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-700"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default DropdownButton;
