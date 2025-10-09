import { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  footer,
}: ModalProps) => {
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={`
            fixed left-[50%] top-[50%] z-modal translate-x-[-50%] translate-y-[-50%]
            w-[90vw] ${sizeStyles[size]} max-h-[90vh]
            bg-white rounded-xl shadow-2xl
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
            focus:outline-none
          `}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-neutral-200">
            <Dialog.Title className="font-heading text-2xl text-espresso-600 mb-2">
              {title}
            </Dialog.Title>

            {description && (
              <Dialog.Description className="text-body-sm text-neutral-600">
                {description}
              </Dialog.Description>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute right-6 top-6 rounded-base p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-8 py-6 border-t border-neutral-200 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
