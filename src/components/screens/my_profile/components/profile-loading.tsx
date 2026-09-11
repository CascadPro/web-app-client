import { Skeleton } from "@/components/ui"

export const ProfileLoading = () => {
	return (
		<div className="mx-auto max-w-3xl space-y-6 sm:py-10">
			<Skeleton className="flex w-full flex-col items-center gap-4 rounded-3xl p-5 sm:flex-row">
				<Skeleton className="size-24 rounded-full" />
				<div className="space-y-3">
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-5 w-36" />
				</div>
			</Skeleton>

			<Skeleton className="flex w-full flex-col items-center gap-4 rounded-3xl p-5">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</Skeleton>

			<Skeleton className="flex w-full flex-col items-center gap-4 rounded-3xl p-5">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</Skeleton>
		</div>
	)
}
