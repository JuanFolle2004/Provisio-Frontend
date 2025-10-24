export default function Input({ className = "", ...props }: any) {
  return (
    <input
      className={`w-full rounded-2xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
}
