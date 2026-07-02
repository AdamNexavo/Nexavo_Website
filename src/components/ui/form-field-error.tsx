import { AlertCircle } from "lucide-react";

type FormFieldErrorProps = {
  message?: string;
};

export const FormFieldError = ({ message }: FormFieldErrorProps) => {
  if (!message) return null;

  return (
    <p
      className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-destructive"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      <span>{message}</span>
    </p>
  );
};

export const inputErrorClass = (hasError: boolean) =>
  hasError
    ? "border-destructive/45 bg-destructive/[0.03] focus-visible:ring-destructive/20"
    : "";
