import { useState } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { useOutsideClick } from "../../hooks/useOutsideClick";

import { cn } from "../../utils/styles";

type Option = {
  label: string;
  value: unknown;
};

type MultiselectProps<T extends FieldValues, K extends Option> = {
  options: Array<K>;
  register: UseFormRegister<T>;
  setFormValue: UseFormSetValue<T>;
  isError: boolean;
  name: Path<T>;
};

const Multiselect = <T extends FieldValues, K extends Option>({
  register,
  setFormValue,
  isError,
  name,
  options,
}: Readonly<MultiselectProps<T, K>>) => {
  const [selected, setSelected] = useState<K[]>([]);
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const outsideClickRef = useOutsideClick(() => setIsToggled(false));

  function handleToggle() {
    setIsToggled((prev) => !prev);
  }

  function isOptionInSelected(option: Option) {
    return selected.some((item) => item.label === option.label);
  }

  function handleSelect(option: K) {
    if (isOptionInSelected(option)) {
      const newSelected = selected.filter(
        (selectedOption) => selectedOption.label !== option.label,
      );

      setFormValue(name, newSelected as PathValue<string[], Path<unknown>>, {
        shouldValidate: true,
      });

      setSelected(newSelected);
    } else {
      setSelected((prev) => [...prev, option]);

      setFormValue(
        name,
        [...selected, option] as PathValue<string[], Path<unknown>>,
        {
          shouldValidate: true,
        },
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLSelectElement>) {
    if (e.code === "Space") {
      handleToggle();
    }
  }

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "relative z-10 w-full rounded-[20px] bg-gray-100 after:absolute after:right-5 after:top-1/2 after:-z-[1] after:h-5 after:-translate-y-1/2 after:items-center after:content-[url('arrow.svg')]",
        { "after:rotate-180": isToggled },
      )}
    >
      <select
        className="peer absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
        {...register(name)}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onBlur={() => {}}
        onChange={() => {}}
        multiple
      />
      <span
        className={cn(
          "inline-block h-full w-full rounded-[20px] border border-gray-200 p-5 text-lg text-gray-400 peer-focus:border-gray-200 peer-focus:outline peer-focus:outline-2 peer-focus:outline-gray-400",
          {
            "font-medium text-gray-950": selected.length > 0,
            "border-error": isError,
          },
        )}
      >
        {selected.length > 0
          ? selected.map((option) => option.label).join(", ")
          : "Your skill"}
      </span>

      <ul
        className={cn(
          "absolute left-0 top-[calc(100%+8px)] hidden w-full rounded-[20px] border border-gray-200 bg-gray-50",
          { block: isToggled },
        )}
      >
        {options.map((option) => (
          <li
            className="relative w-full after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-gray-200 last:after:hidden"
            key={option.label}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
              className={cn(
                "w-full px-6 py-[18px] text-left text-lg font-medium text-gray-400 focus:rounded-[20px] focus:outline-gray-400",
                { "text-gray-950": isOptionInSelected(option) },
              )}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Multiselect;
