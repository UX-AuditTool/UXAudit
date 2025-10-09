import { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && (
        <div className="mb-4 text-neutral-400">
          {icon}
        </div>
      )}

      <h3 className="font-heading text-xl text-espresso-600 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-body-sm text-neutral-600 max-w-md mb-6">
          {description}
        </p>
      )}

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
