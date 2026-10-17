import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { Button } from "@/components/ui"
import type { ReactStateHook } from "@/types/base"

import { useRequestCardActions } from "../../hooks/useRequestCardActions"

export interface Props {
	id: string
	selected: boolean
	isCollapsed: boolean
	setIsCollapsed: ReactStateHook<boolean>
}

export const RequestCardActions: FC<Props> = ({
	id,
	selected,
	isCollapsed,
	setIsCollapsed
}) => {
	return (
		<AnimatePresence>
			{selected && (
				<RequestCardActionsContent
					key={id}
					id={id}
					isCollapsed={isCollapsed}
					setIsCollapsed={setIsCollapsed}
				/>
			)}
		</AnimatePresence>
	)
}

interface ContentProps {
	id: string
	isCollapsed: boolean
	setIsCollapsed: ReactStateHook<boolean>
}

const RequestCardActionsContent: FC<ContentProps> = ({
	id,
	isCollapsed,
	setIsCollapsed
}) => {
	const handleCollapse = () => {
		setIsCollapsed(previous => !previous)
	}

	const { actions, disabled } = useRequestCardActions(id, handleCollapse)

	return (
		<m.div
			className="bg-surface static w-fit space-y-2 self-end overflow-hidden rounded-2xl p-3 shadow-lg"
			initial={{ opacity: 0.75, height: 0, y: 8 }}
			animate={{
				opacity: 1,
				height: !isCollapsed ? "3.75rem" : "9.5rem",
				y: 0
			}}
			exit={{ opacity: 0, y: 16, height: 0, padding: 0 }}
			transition={{
				duration: 0.22,
				ease: [0.22, 1, 0.36, 1]
			}}
		>
			{actions.map(({ key, title, Icon, loading, onClick }) => (
				<Button
					key={key}
					variant="ghost"
					className="active:bg-outline/20 flex w-full justify-start gap-2 rounded-xl px-6 py-2 transition-colors will-change-auto motion-reduce:transition-none"
					onClick={onClick}
					isLoading={loading}
					disabled={disabled || (key !== "details" && !isCollapsed)}
				>
					<Icon size={18} className="mt-0.5" />
					{title}
				</Button>
			))}
		</m.div>
	)
}
