import { forwardRef, useState } from "react";
import { cn } from "../../utils/styles";

type CheckboxProps = {
  label: string;
  className?: string;
  labelClassName?: string;
  isError: boolean;
} & React.ComponentPropsWithoutRef<"input">;

const Checkbox = forwardRef<React.ElementRef<"input">, Readonly<CheckboxProps>>(
  (
    { className, labelClassName, isError, label, onChange, ...props },
    forwardedRef,
  ) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (onChange) {
        onChange(e);
      }
      setIsChecked((prev) => !prev);
    }

    return (
      <label
        className={cn(
          "flex max-w-max items-center gap-4 hover:cursor-pointer",
          labelClassName,
        )}
      >
        <span
          className={cn(
            "relative h-6 w-6 rounded-lg border border-indigo-600",
            {
              "border-error": isError,
            },
          )}
        >
          <input
            type="checkbox"
            className="peer absolute left-0 top-0 h-full w-full rounded-lg opacity-0"
            ref={forwardedRef}
            checked={isChecked}
            onChange={handleChange}
            {...props}
          />
          <span
            className={cn(
              "absolute left-0 top-0 h-full w-full rounded-lg hover:cursor-pointer hover:bg-indigo-100 peer-focus:outline peer-focus:outline-indigo-400",
              className,
              {
                "after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:content-[url('/check.svg')]":
                  isChecked,
              },
            )}
          ></span>
        </span>
        <span className="text-lg text-gray-500">{label}</span>
      </label>
    );
  },
);

export default Checkbox;
