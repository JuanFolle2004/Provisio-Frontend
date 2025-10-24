export const Card = ({ className = "", children }: any) => (
  <div
    className={`rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ children }: any) => (
  <div className="px-5 pt-5">{children}</div>
);

export const CardTitle = ({ children }: any) => (
  <h3 className="text-base font-semibold tracking-tight">{children}</h3>
);

export const CardContent = ({ className = "", children }: any) => (
  <div className={`p-5 pt-3 ${className}`}>{children}</div>
);
