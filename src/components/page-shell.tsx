import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description: string;
  countLabel: string;
  children: ReactNode;
}

export function PageShell({
  title,
  description,
  countLabel,
  children,
}: PageShellProps) {
  return (
    <section className="page-shell">
      <div className="page-heading">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <span className="page-count">{countLabel}</span>
      </div>
      {children}
    </section>
  );
}
