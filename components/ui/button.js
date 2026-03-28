import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-transparent transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "premium-btn-primary",
        destructive:
          "border border-white/45 bg-[linear-gradient(145deg,#ff8a8a,#d6263a)] text-destructive-foreground shadow-[8px_10px_22px_rgba(160,38,52,0.4),_-6px_-6px_14px_rgba(255,192,196,0.48),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-105",
        outline: "premium-btn-ghost",
        secondary: "premium-btn-secondary",
        ghost: "premium-btn-ghost",
        link: "border-0 bg-transparent p-0 text-primary shadow-none hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 py-1.5 text-xs",
        lg: "h-12 px-8 py-3",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = ({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
};

Button.displayName = "Button";

export { Button, buttonVariants };
