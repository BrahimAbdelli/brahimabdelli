import type React from 'react';

interface TechStackProps {
  readonly value: string;
}

export default function TechStack({ value }: TechStackProps): React.ReactElement {
  const items: string[] = value.split(',').map((item: string) => item.trim()).filter(Boolean);

  return (
    <div className='flex flex-wrap gap-2 mt-2'>
      {items.map((item: string) => {
        const trimmed: string = item.trim();
        const colonIdx: number = trimmed.indexOf(':');
        const rest: string = colonIdx >= 0 ? trimmed.slice(colonIdx + 1).trim() : trimmed;

        return (
          <span
            key={rest}
            className='inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-200/90 dark:bg-slate-800/90 text-slate-800 dark:text-green-custom border border-slate-300 dark:border-slate-700'
          >
            {rest}
          </span>
        );
      })}
    </div>
  );
}
