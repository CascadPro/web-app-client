"use client"

import type { LucideIcon } from "lucide-react"
import { m } from "motion/react"

import { Title } from "@/components/ui"

interface SettingsSectionProps {
	id: string
	title: string
	description?: string
	icon: LucideIcon
	children: React.ReactNode
}

export const SettingsSection = ({
	id,
	title,
	description,
	icon: Icon,
	children
}: SettingsSectionProps) => (
	<m.section
		initial={{ opacity: 0, y: 10 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true, amount: "some" }}
		transition={{ duration: 0.3 }}
		aria-labelledby={`${id}-title`}
		className="min-w-0 space-y-3"
	>
		<div className="flex items-center gap-3 px-1">
			<div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
				<Icon aria-hidden="true" size={20} />
			</div>

			<div className="min-w-0">
				<Title size="lg" id={`${id}-title`} className="text-on-surface text-lg">
					{title}
				</Title>

				{description && (
					<p className="text-on-surface-variant text-sm">{description}</p>
				)}
			</div>
		</div>

		<div className="border-outline/20 bg-surface overflow-hidden rounded-2xl border shadow-sm">
			{children}
		</div>
	</m.section>
)
