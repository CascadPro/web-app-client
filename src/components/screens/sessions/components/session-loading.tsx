import { Skeleton } from "@/components/ui"

export const SessionLoading = () => {
	return (
		<div className="border-outline/20 bg-surface rounded-2xl border p-4 shadow-sm">
			<div className="flex gap-4">
				<Skeleton className="size-11 shrink-0 rounded-xl" />

				<div className="flex-1 space-y-3">
					<Skeleton className="h-5 w-40 rounded" />
					<Skeleton className="h-3 w-40 rounded" />
				</div>
			</div>
		</div>
	)
}
