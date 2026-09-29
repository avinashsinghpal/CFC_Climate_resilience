import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  id: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, options, placeholder, className = "", ...props }, ref) => {
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
        <select
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
            "focus:outline-none focus:ring-2 focus:ring-focus focus:border-primary",
            "disabled:bg-paper disabled:text-muted disabled:cursor-not-allowed",
            "appearance-none",
            error ? "border-red-700" : "",
            className,
          ].join(" ")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2355605A' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "36px",
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${id}-error`} role="alert" className="text-14 text-red-700">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
