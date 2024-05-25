import { cn } from "../../utils/styles";

type ErrorMessageProps = {
  className?: string;
  errorMessage: string | undefined;
};

const ErrorMessage = ({
  errorMessage,
  className,
}: Readonly<ErrorMessageProps>) => {
  return <span className={cn("text-error", className)}>{errorMessage}</span>;
};

export default ErrorMessage;
