import { ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
  className?: string;
  showBullet?: boolean;
}

// Simple green bullet component
function GreenBullet({ className = "" }: { className?: string }) {
  return (
    <div className={`w-3 h-3 bg-primary-500 rounded-full flex-shrink-0 ${className}`} />
  );
}

export function PageTitle({
  children,
  className = "",
  showBullet = true
}: PageTitleProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {showBullet && <GreenBullet className="mt-1.5" />}
      <div className="min-w-0 [&>*]:inline [&>*>*]:inline">
        {children}
        <span className="inline-block h-1 w-12 bg-primary-500 ml-2 align-middle" />
      </div>
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <div className={`flex items-start gap-3 mb-6 ${className}`}>
      <GreenBullet className="mt-1.5" />
      <div className="min-w-0">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 inline">{children}</h2>
        <span className="inline-block h-1 w-12 bg-primary-500 ml-2 align-middle" />
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  difficulty?: 'beginner' | 'medium' | 'advanced';
}

export function PageHeader({ title, subtitle, difficulty }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <PageTitle>
        <h1 className="text-2xl font-black text-gray-900 uppercase inline">{title}</h1>
        {difficulty && (
          <span className={`inline-block px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-300 rounded align-middle ml-2`}>
            {difficulty}
          </span>
        )}
      </PageTitle>
      {subtitle && <p className="text-gray-700 mt-1">{subtitle}</p>}
    </div>
  );
}
