import { forwardRef } from "react";
import { cn } from "../../utils/styles";

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">;

const Button = forwardRef<React.ElementRef<"button">, Readonly<ButtonProps>>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <button
        className={cn(
          "rounded-full bg-indigo-600 p-5 font-medium text-white hover:bg-indigo-500 focus:outline-indigo-800",
          className,
        )}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;
