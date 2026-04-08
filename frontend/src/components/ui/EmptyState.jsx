// Empty state with icon, title, description and optional CTA
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-alt text-ink-3">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-ink-3">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
