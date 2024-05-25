import { forwardRef } from "react";
import { cn } from "../../utils/styles";

type InputProps = {
  label: string;
  className?: string;
  isError: boolean;
} & React.ComponentPropsWithoutRef<"input">;

const Input = forwardRef<React.ElementRef<"input">, Readonly<InputProps>>(
  ({ label, className, placeholder, isError, ...props }, forwardedRef) => {
    return (
      <input
        className={cn(
          "w-full rounded-[20px] border border-gray-200 bg-gray-100 p-5 text-lg font-medium text-gray-950 placeholder:font-normal placeholder:text-gray-400 focus:outline-gray-400",
          className,
          { "border-error": isError },
        )}
        placeholder={placeholder}
        aria-label={label}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export default Input;
