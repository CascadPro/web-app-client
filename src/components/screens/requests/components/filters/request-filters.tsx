import { ChevronDownIcon, SortDescIcon, XIcon } from "lucide-react"
import dynamic from "next/dynamic"
import type { FC } from "react"

import { Button, Separator } from "@/components/ui"
import { REQUEST_STATUSES } from "@/libs/constants/screens/requests"
import { cn, getSortLabel } from "@/libs/utils"

import { useRequestFilters } from "../../hooks/useRequestFilters"

const DynamicRequestFiltersSheet = dynamic(
	async () => (await import("./request-filters-sheet")).RequestFiltersSheet,
	{ ssr: false }
)

interface Props {
	isLoading: boolean
}

export const RequestFilters: FC<Props> = ({ isLoading }) => {
	const {
		sortType,
		isOpen,
		isClearDisabled,
		isActive,
		setIsOpen,
		toggleStatus,
		setSortType,
		clearFilters
	} = useRequestFilters()

	return (
		<>
			<section className="border-outline/20 bg-surface rounded-3xl border p-5 shadow-sm sm:p-6">
				<div className="flex items-center justify-between">
					<Button
						variant="default-2"
						className="gap-1 p-2"
						onClick={() => setIsOpen(true)}
						disabled={isLoading}
					>
						<SortDescIcon
							size={18}
							className={cn(
								"mt-0.5 transition-transform will-change-transform",
								sortType === "oldest" && "rotate-180"
							)}
						/>

						{getSortLabel(sortType)}

						<ChevronDownIcon size={18} className="mt-0.5" />
					</Button>

					<Button
						variant="destructive"
						className="p-2"
						onClick={clearFilters}
						disabled={isClearDisabled || isLoading}
					>
						<XIcon size={18} />
					</Button>
				</div>

				<Separator type="horizontal" className="my-5 opacity-40" />

				<div className="flex flex-wrap gap-2">
					{REQUEST_STATUSES.map(status => (
						<Button
							key={status.value}
							variant="outline"
							onClick={() => toggleStatus(status.value)}
							disabled={isLoading}
							className={cn("p-2", {
								"bg-primary/10 border-primary text-primary": isActive(
									status.value
								)
							})}
						>
							{status.label}
						</Button>
					))}
				</div>
			</section>

			<DynamicRequestFiltersSheet
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				setSortType={setSortType}
			/>
		</>
	)
}
