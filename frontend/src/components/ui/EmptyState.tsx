import { type ReactNode } from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <SearchX
        size={40}
        className="text-muted mb-4"
        aria-hidden="true"
        strokeWidth={1.5}
      />
      <h3 className="text-20 font-semibold text-ink mb-2">{title}</h3>
      {description && (
        <p className="text-16 text-muted max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
