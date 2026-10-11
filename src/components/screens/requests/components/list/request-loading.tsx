import { Skeleton } from "@/components/ui"

export const RequestLoading = () => {
	return (
		<div className="grid gap-5">
			{Array.from({ length: 2 }).map((_, index) => (
				<RequestLoadingCard key={index} />
			))}
		</div>
	)
}

export const RequestLoadingCard = () => {
	return (
		<Skeleton className="w-full space-y-4 rounded-2xl p-5">
			<div className="flex items-center justify-between">
				<Skeleton className="h-7 w-1/2" />
				<Skeleton className="h-6 w-20" />
			</div>

			<Skeleton className="h-4 w-2/3" />
			<Skeleton className="h-4 w-2/3" />

			<Skeleton className="h-6 w-full" />
		</Skeleton>
	)
}
