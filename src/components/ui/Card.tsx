import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: ReactNode;
}

const Card = ({ hover = false, children, className = '', ...props }: CardProps) => {
  return (
    <div
      className={`
        bg-white border border-neutral-200 rounded-md shadow-sm
        ${hover ? 'transition-all duration-fast hover:shadow-md hover:border-teal-200 hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const CardHeader = ({ title, subtitle, actions, className = '', ...props }: CardHeaderProps) => {
  return (
    <div className={`px-5 py-4 border-b border-neutral-200 ${className}`} {...props}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-lg text-espresso-600">{title}</h3>
          {subtitle && <p className="text-body-sm text-neutral-600 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export const CardContent = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`px-5 py-4 border-t border-neutral-200 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
