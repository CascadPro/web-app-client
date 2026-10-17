import { LoaderIcon } from "lucide-react"
import { m } from "motion/react"
import { memo } from "react"

import { Button, Separator } from "@/components/ui"

import { useRequestStats } from "../hooks/useRequestStats"

const RequestsStatsComponent = () => {
	const { stats, isPending } = useRequestStats()

	return (
		<section className="border-outline/20 bg-surface relative grid grid-cols-2 gap-4 rounded-3xl border p-4 shadow-sm select-none sm:p-5 lg:grid-cols-4">
			{stats.map(stat => (
				<Button
					key={stat.label}
					variant="ghost"
					className="block px-4 py-3 text-left active:translate-y-1 active:scale-[0.98]"
					onClick={stat.onClick}
				>
					<p className="text-on-surface-variant text-sm">{stat.label}</p>

					<p className="text-on-surface mt-2 text-2xl font-semibold tracking-tight">
						{isPending ? (
							<LoaderIcon
								size={20}
								className="animate-spin motion-reduce:animate-none"
							/>
						) : (
							<m.span
								initial={{ y: 15, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ type: "tween" }}
								className="block"
							>
								{stat.value}
							</m.span>
						)}
					</p>
				</Button>
			))}

			<Separator
				type="horizontal"
				className="absolute top-1/2 left-1/2 w-11/12 -translate-1/2 opacity-40 lg:hidden"
			/>

			<Separator
				type="vertical"
				className="absolute top-1/2 left-1/2 h-11/12 -translate-1/2 opacity-40 lg:hidden"
			/>
		</section>
	)
}

export const RequestsStats = memo(RequestsStatsComponent)
