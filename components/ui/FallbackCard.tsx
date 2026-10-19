interface FallbackCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function FallbackCard({ icon, title, description, children }: FallbackCardProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-8 max-w-md w-full space-y-4">
        {icon && <div className="flex justify-center text-gray-500">{icon}</div>}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        {children && <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">{children}</div>}
      </div>
    </div>
  );
}