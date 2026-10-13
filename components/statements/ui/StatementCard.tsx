type StatementCardProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function StatementCard({ title, action, children }: StatementCardProps) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-semibold text-xs text-gray-900 uppercase tracking-wider">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}