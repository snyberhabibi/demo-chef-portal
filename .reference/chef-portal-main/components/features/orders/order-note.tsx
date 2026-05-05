"use client";

interface OrderNoteProps {
  note: string;
}

export function OrderNote({ note }: OrderNoteProps) {
  if (!note) return null;

  return (
    <div data-testid="order-note">
      <h3 className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] uppercase tracking-wider text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">
        Order Note
      </h3>
      <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-300)]">
        <p className="text-[0.8125rem] text-[var(--p-color-text)]" data-testid="order-note-text">{note}</p>
      </div>
    </div>
  );
}
