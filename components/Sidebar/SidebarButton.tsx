import { FC } from 'react';

interface Props {
  text: string;
  icon: JSX.Element;
  iconRight?: JSX.Element;
  onClick: () => void;
  textClassName?: string;
}

export const SidebarButton: FC<Props> = ({
  text,
  icon,
  iconRight,
  onClick,
  textClassName,
}) => {
  return (
    <button
      className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={onClick}
    >
      {icon}
      <span className={'overflow-clip text-ellipsis ' + textClassName}>
        {text}
      </span>
      <div className="flex-shrink">{iconRight}</div>
    </button>
  );
};
