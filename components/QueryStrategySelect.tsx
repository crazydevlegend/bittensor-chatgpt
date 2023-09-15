import React, { useEffect, useState } from 'react';

import { Input } from './Input';
import { RadioButton } from './RadioButton';

interface QueryStrategySelectProps {
  selection: string;
  onSelectionChange: (value: string) => void;
  uids?: string;
  onUidsChange?: (value: string) => void;
  top_n?: number;
  onTopNChange?: (value: number) => void;
}

export const QueryStrategySelect: React.FC<QueryStrategySelectProps> = ({
  selection,
  onSelectionChange,
  uids,
  onUidsChange,
  top_n,
  onTopNChange,
}) => {
  const [nameRandom, setNameRandom] = useState('');
  useEffect(() => {
    const random = Math.random();
    setNameRandom(random.toString());
  }, []);

  return (
    <div>
      <fieldset className="flex gap-2">
        <RadioButton
          label="Top miners"
          id="radio-top_n"
          name={'query-strategy' + nameRandom}
          value="top_n"
          checked={selection === 'top_n'}
          onChange={(e) => onSelectionChange(e.target.value)}
        />
        <RadioButton
          label="Specific UIDs"
          id="radio-uids"
          name={'query-strategy' + nameRandom}
          value="uids"
          checked={selection === 'uids'}
          onChange={(e) => onSelectionChange(e.target.value)}
        />
        <RadioButton
          label="Unspecified"
          id="radio-unspecified"
          name={'query-strategy' + nameRandom}
          value="unspecified"
          checked={selection === 'unspecified'}
          onChange={(e) => onSelectionChange(e.target.value)}
        />
      </fieldset>
      {selection === 'uids' && (
        <Input
          type="text"
          placeholder="UIDs (comma-separated)"
          value={uids}
          onChange={(e) => onUidsChange && onUidsChange(e.target.value)}
        />
      )}
      {selection === 'top_n' && (
        <Input
          type="number"
          min="1"
          placeholder="Top miners"
          value={top_n}
          onChange={(e) => onTopNChange && onTopNChange(Number(e.target.value))}
        />
      )}
    </div>
  );
};
