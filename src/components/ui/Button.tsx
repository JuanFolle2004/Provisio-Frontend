import type { ComponentProps, ElementType } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  as?: ElementType;
  variant?: "primary" | "outline" | "ghost";
}

export default function Button({
  as: Comp = "button",
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    outline:
      "border border-gray-300 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800",
    ghost: "hover:bg-gray-100 dark:hover:bg-zinc-800",
  };

  return (
    <Comp
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
