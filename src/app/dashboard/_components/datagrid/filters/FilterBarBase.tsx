'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

type Props<TFilter extends object> = {
  children?: React.ReactNode;
  onSubmit?: (values: TFilter) => void;
  className?: string;
};

// A simple wrapper that provides a horizontal filter bar layout and optional submit handling.
export default function FilterBarBase<TFilter extends object>({ children, onSubmit, className }: Props<TFilter>) {
  const { handleSubmit } = useFormContext<TFilter>();

  return (
    <form
      className={className ?? 'mb-3 flex flex-wrap items-end gap-3'}
      onSubmit={onSubmit ? handleSubmit((vals) => onSubmit(vals)) : undefined}
    >
      {children}
      {onSubmit && (
        <button type="submit" className="rounded border px-3 py-1 text-sm">
          Search
        </button>
      )}
    </form>
  );
}