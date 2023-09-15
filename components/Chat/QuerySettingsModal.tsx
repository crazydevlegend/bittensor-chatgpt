import { IconArrowBack } from '@tabler/icons-react';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';

interface Props {
  onSubmit: (uid: number | undefined) => void;
  onClose: () => void;
  uid: number | undefined;
}

export const QuerySettingsModal: FC<Props> = ({
  onSubmit,
  onClose,
  uid: initialUid,
}) => {
  const [uid, setUid] = useState<number | undefined>(initialUid);

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    onSubmit(uid);
    onClose();
  };

  const resetSubmit = () => {
    onSubmit(undefined);
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setUid(undefined);
      onSubmit(undefined);
      onClose();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        // console.log('outside click');
        // onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
        role="dialog"
      >
        <div className="flex gap-2">
          <input
            ref={nameInputRef}
            type={'number'}
            max="1024"
            min="0"
            className="flex-grow rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
            style={{ resize: 'none' }}
            placeholder={`Enter a specific uid to query (0-1023)`}
            value={uid}
            onChange={(e) => setUid(Number(e.target.value))}
          />
          <button
            className="rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
            onClick={handleSubmit}
          >
            Use specific UID
          </button>
        </div>
        <button
          className="flex items-center gap-1 mt-6 rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
          onClick={resetSubmit}
        >
          <IconArrowBack size="1em" />
          Use automatic UID
        </button>
      </div>
    </div>
  );
};
