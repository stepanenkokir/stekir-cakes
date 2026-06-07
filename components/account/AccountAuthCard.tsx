import type { ReactNode } from "react";

type AccountAuthCardProps = {
  title: string;
  intro: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AccountAuthCard({ title, intro, children, footer }: AccountAuthCardProps) {
  return (
    <main className="min-h-screen bg-bg px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 shadow-card">
        <h1 className="font-display text-3xl text-text">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">{intro}</p>
        {children}
        {footer ? <div className="mt-6 border-t border-border pt-6 text-center">{footer}</div> : null}
      </div>
    </main>
  );
}
