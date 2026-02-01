import { ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
  underlineColor?: string;
  className?: string;
}

export function PageTitle({ 
  children, 
  underlineColor = "bg-primary-500",
  className = ""
}: PageTitleProps) {
  return (
    <div className={`relative inline-block group ${className}`}>
      {children}
      <span className={`absolute -bottom-0.5 left-0 w-12 h-0.5 ${underlineColor} transition-all group-hover:w-full duration-300`} />
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <div className={`relative inline-block group mb-6 ${className}`}>
      <h2 className="text-xl md:text-3xl font-bold text-gray-900">{children}</h2>
      <span className="absolute -bottom-1 left-0 w-12 h-1 bg-primary-500 transition-all group-hover:w-full duration-300" />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  difficulty?: 'beginner' | 'medium' | 'advanced';
}

export function PageHeader({ title, subtitle, difficulty }: PageHeaderProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    advanced: 'bg-red-100 text-red-700 border-red-300'
  };

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
