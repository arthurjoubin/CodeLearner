import { ChevronRight } from 'lucide-react';

interface PathItem {
  name: string;
  current: number;
  total: number;
  href?: string;
  parent?: {
    name: string;
    href?: string;
  };
}

interface ProgressPathProps {
  items: PathItem[];
}

export default function ProgressPath({ items }: ProgressPathProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-bold">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
          <div className="flex items-center gap-1.5">
            {item.parent && (
              <>
                {item.parent.href ? (
                  <a
                    href={item.parent.href}
                    className="text-gray-500 hover:text-primary-600 transition-colors uppercase tracking-wide"
                  >
                    {item.parent.name}
                  </a>
                ) : (
                  <span className="text-gray-500 uppercase tracking-wide">{item.parent.name}</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors uppercase tracking-wide"
              >
                {item.name}
              </a>
            ) : (
              <span className="text-gray-800 uppercase tracking-wide">{item.name}</span>
            )}
            <span className="inline-flex items-center px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-[10px] font-bold border border-primary-200">
              {item.current}/{item.total}
            </span>
          </div>
        </div>
      ))}
    </nav>
  );
}
