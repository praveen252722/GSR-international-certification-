export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded border border-moss/10 bg-white p-5 shadow-soft ${className}`}>{children}</div>;
}
