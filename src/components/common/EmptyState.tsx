interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-muted/40 p-10 text-center">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
    </div>
    {action}
  </div>
)
