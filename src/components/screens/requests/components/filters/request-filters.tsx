import { ChevronDownIcon, SortDescIcon, XIcon } from "lucide-react"
import { m } from "motion/react"
import dynamic from "next/dynamic"
import { type FC, useState } from "react"

import { type DomainRequestStatus, DomainSortType } from "@/api/generated"
import { Button, Separator } from "@/components/ui"
import { cn, getSortLabel } from "@/libs/utils"

import { REQUEST_STATUSES } from "../../constants"

const DynamicRequestFiltersSheet = dynamic(
	async () => (await import("./request-filters-sheet")).RequestFiltersSheet,
	{ ssr: false }
)

interface Props {
	sortType: DomainSortType
	onSortTypeChange: (value: DomainSortType) => void

	statuses: DomainRequestStatus[]
	onStatusesChange: (value: DomainRequestStatus[]) => void

	clearDisabled: boolean
	clearFilters: (() => void) | undefined
}

export const RequestFilters: FC<Props> = ({
	sortType,
	onSortTypeChange,
	statuses,
	onStatusesChange,
	clearDisabled,
	clearFilters
}) => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleStatus = (status: DomainRequestStatus) => {
		onStatusesChange(
			statuses.includes(status)
				? statuses.filter(item => item !== status)
				: [...statuses, status]
		)
	}

	const isActive = (value: DomainRequestStatus) => statuses.includes(value)

	return (
		<>
			<m.section
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="border-outline/20 bg-surface rounded-3xl border p-5 shadow-sm sm:p-6"
			>
				<div className="flex items-center justify-between">
					<Button
						variant="default-2"
						className="gap-1 p-2"
						onClick={() => setIsOpen(true)}
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
						disabled={clearDisabled}
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
			</m.section>

			<DynamicRequestFiltersSheet
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				setSortType={onSortTypeChange}
			/>
		</>
	)
}
