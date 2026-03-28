import { cn } from "@/lib/utils";

const Input = ({ className, type = "text", ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "premium-input flex h-11 w-full text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    ref={ref}
    {...props}
  />
);

Input.displayName = "Input";

export { Input };
