import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-14 font-medium text-ink">
          {label}
          {props.required && (
            <span className="text-red-700 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {hint && (
          <p id={`${id}-hint`} className="text-14 text-muted">
            {hint}
          </p>
        )}
        <input
          ref={ref}
          id={id}
          aria-describedby={
            [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          aria-invalid={!!error}
          className={[
            "w-full px-3 py-2 text-16 text-ink bg-surface",
            "border border-border rounded-sm",
            "focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-0 focus:border-primary",
            "disabled:bg-paper disabled:text-muted disabled:cursor-not-allowed",
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

Input.displayName = "Input";
