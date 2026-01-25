import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-xs font-bold mb-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />}
          {item.href ? (
            <Link
              to={item.href}
              className="text-gray-700 hover:text-primary-600 transition-colors uppercase"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 uppercase">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
