import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  id: string;
  showCount?: boolean;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      id,
      showCount = false,
      maxLength,
      currentLength,
      className = "",
      ...props
    },
    ref
  ) => {
    const count = currentLength ?? 0;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <label htmlFor={id} className="text-14 font-medium text-ink">
            {label}
            {props.required && (
              <span className="text-red-700 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {showCount && maxLength !== undefined && (
            <span
              className={`text-14 font-mono ${count > maxLength ? "text-red-700" : "text-muted"}`}
              aria-live="polite"
              aria-label={`${count} of ${maxLength} characters used`}
            >
              {count}/{maxLength}
            </span>
          )}
        </div>
        {hint && (
          <p id={`${id}-hint`} className="text-14 text-muted">
            {hint}
          </p>
        )}
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          aria-describedby={
            [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-invalid={!!error}
          className={[
            "w-full px-3 py-2 text-16 text-ink bg-surface",
            "border border-border rounded-sm",
            "focus:outline-none focus:ring-2 focus:ring-focus focus:border-primary",
            "disabled:bg-paper disabled:text-muted disabled:cursor-not-allowed",
            "resize-y min-h-[100px]",
            error ? "border-red-700" : "",
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} role="alert" className="text-14 text-red-700">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
