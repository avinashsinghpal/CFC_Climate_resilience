import { type ReactNode, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white border border-primary hover:bg-primary-hover hover:border-primary-hover",
  secondary:
    "bg-surface text-primary border border-primary hover:bg-paper",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-ink hover:bg-paper hover:border-border",
  danger:
    "bg-red-700 text-white border border-red-700 hover:bg-red-800",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-14",
  md: "px-4 py-2 text-16",
  lg: "px-6 py-3 text-16",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium rounded-sm",
        "transition-colors duration-[120ms]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// Shared class helper for Link-as-button usage
export function buttonLinkClasses(
  variant: Variant = "primary",
  size: Size = "md",
  extra: string = ""
): string {
  return [
    "inline-flex items-center justify-center gap-2 font-medium rounded-sm",
    "transition-colors duration-[120ms]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
    variantClasses[variant],
    sizeClasses[size],
    extra,
  ].join(" ");
}
