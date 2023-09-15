import { FC, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';

import { QueryStrategySelect } from '../QueryStrategySelect';

const parseStrategy = (strategy: string | undefined) => {
  if (!strategy)
    return { strategySelection: 'unspecified', uids: '', top_n: 1 };

  const parts = strategy.split(':');

  if (parts[0] === 'top_n') {
    return {
      strategySelection: 'top_n',
      uids: '',
      top_n: parseInt(parts[1], 10),
    };
  }

  if (parts[0] === 'uids') {
    return { strategySelection: 'uids', uids: parts[1], top_n: 1 };
  }

  return { strategySelection: 'unspecified', uids: '', top_n: 1 };
};

interface Props {
  apiKey: any;
  type: 'edit' | 'new';
  onClose: () => void;
  onUpdate: (apiKey: any) => Promise<void>;
}

export const ApiKeyModal: FC<Props> = ({ apiKey, onClose, onUpdate, type }) => {
  const [name, setName] = useState(apiKey?.name || '');

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const parsed = parseStrategy(apiKey?.default_query_strategy);
  console.log('hello', apiKey, parsed);

  const [strategySelection, setStrategySelection] = useState(
    parsed.strategySelection,
  );
  const [uids, setUids] = useState(parsed.uids);
  const [top_n, setTopN] = useState(parsed.top_n);

  // This will be the computed value to be sent to the database
  const default_query_strategy = useMemo(() => {
    if (strategySelection === 'unspecified') {
      return null;
    }
    if (strategySelection === 'top_n') {
      return `top_n:${top_n}`;
    }
    if (strategySelection === 'uids' && uids) {
      return `uids:${uids}`;
    }
    return null;
  }, [strategySelection, uids, top_n]);

  const handleUpdate = async () => {
    await onUpdate({ ...apiKey, name, default_query_strategy });
    onClose();
  };

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleUpdate();
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onKeyDown={handleEnter}
    >
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="text-sm font-bold text-black dark:text-neutral-200">
              API Key Name
            </div>
            <input
              ref={nameInputRef}
              className="mt-2 w-full rounded-lg border border-neutral-500 px-4 py-2 text-neutral-900 shadow focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-[#40414F] dark:text-neutral-100"
              placeholder={'A name for your API key' || ''}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="text-sm font-bold text-black dark:text-neutral-200">
              Default Query Strategy
            </div>
            <QueryStrategySelect
              selection={strategySelection}
              onSelectionChange={setStrategySelection}
              uids={uids}
              onUidsChange={setUids}
              top_n={top_n}
              onTopNChange={setTopN}
            />

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={handleUpdate}
            >
              {type === 'edit' ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
