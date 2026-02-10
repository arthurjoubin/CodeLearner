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
    <div className={`flex flex-col gap-0 ${className}`}>
      <div className="flex items-baseline gap-3">
        {showBullet && <GreenBullet className="self-center" />}
        {children}
      </div>
      <span className="block h-1 w-12 bg-primary-500 mt-3" />
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <div className={`flex flex-col gap-0 mb-6 ${className}`}>
      <div className="flex items-baseline gap-3">
        <GreenBullet className="self-center" />
        <h2 className="text-xl md:text-3xl font-bold text-gray-900">{children}</h2>
      </div>
      <span className="block h-1 w-12 bg-primary-500 mt-3" />
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
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-gray-900 uppercase">{title}</h1>
          {difficulty && (
            <span className={`px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-300 rounded`}>
              {difficulty}
            </span>
          )}
        </div>
      </PageTitle>
      {subtitle && <p className="text-gray-700 mt-1">{subtitle}</p>}
    </div>
  );
}
