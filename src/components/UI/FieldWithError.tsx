import { cn } from "../../utils/styles";

import ErrorMessage from "./ErrorMessage";

type FieldWithErrorProps = {
  className?: string;
  errorClassName?: string;
  children: React.ReactNode;
  errorMessage: string | undefined;
};

const FieldWithError = ({
  children,
  errorMessage,
  className,
  errorClassName,
}: Readonly<FieldWithErrorProps>) => {
  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {children}
      <ErrorMessage className={errorClassName} errorMessage={errorMessage} />
    </div>
  );
};

export default FieldWithError;
