import { TextareaHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  enhanceButton?: ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      enhanceButton,
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-label-base text-espresso-600 mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            required={required}
            className={`
              w-full min-h-[100px] px-3 py-3 pb-10 rounded-base border-[1.5px] font-body text-body-sm text-espresso-500
              placeholder:text-neutral-400 resize-y
              focus:outline-none focus:border-2 focus:border-teal-500 focus:shadow-[0_0_0_3px_rgba(81,108,97,0.12)]
              disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
              transition-all duration-fast
              ${hasError
                ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(139,58,58,0.12)]'
                : 'border-neutral-200'
              }
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
            }
            {...props}
          />
          {enhanceButton && (
            <div className="absolute bottom-2 right-2">
              {enhanceButton}
            </div>
          )}
        </div>

        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-body-xs text-error">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${textareaId}-helper`} className="mt-1 text-body-xs text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
