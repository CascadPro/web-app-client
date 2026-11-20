"use client"

import { AnimatePresence, m, type Variants } from "motion/react"
import { type FC, Fragment, useMemo } from "react"

import type { DomainRequestStatus } from "@/api/generated"
import { DURATION, EASE_OUT, INSTANT, SPRING, useReduceMotion } from "@/libs/motion"

import { useRequestCardActions } from "../../hooks/useRequestCardActions"

import { actionItemVariants, RequestCardActionItem } from "./request-card-action"

const createMenuVariants = (reduceMotion: boolean): Variants => {
	if (reduceMotion) {
		return {
			hidden: { opacity: 0 },
			visible: { opacity: 1, transition: INSTANT },
			exit: { opacity: 0, transition: INSTANT }
		}
	}

	return {
		hidden: { opacity: 0, scale: 0.92, y: -8 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				...SPRING.snappy,
				staggerChildren: 0.04,
				delayChildren: 0.06
			}
		},
		exit: {
			opacity: 0,
			scale: 0.96,
			y: -4,
			transition: { duration: DURATION.fast, ease: EASE_OUT }
		}
	}
}

export interface Props {
	id: string
	status?: DomainRequestStatus
	selected: boolean
	onDetails: () => void
	onEdit: () => void
	onDone: () => void
}

export const RequestCardActions: FC<Props> = ({ selected, ...props }) => (
	<AnimatePresence>
		{selected && <RequestCardActionsContent key={props.id} {...props} />}
	</AnimatePresence>
)

const RequestCardActionsContent: FC<Omit<Props, "selected">> = ({
	id,
	status,
	onDetails,
	onEdit,
	onDone
}) => {
	const reduceMotion = useReduceMotion()
	const menuVariants = useMemo(() => createMenuVariants(reduceMotion), [reduceMotion])
	const groups = useRequestCardActions(id, {
		status,
		onDetails,
		onEdit,
		onDone
	})

	return (
		<m.div
			role="group"
			aria-label="Действия с заявкой"
			variants={menuVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			style={{ transformOrigin: "top right" }}
			className="bg-surface border-outline/20 w-[min(17rem,100%)] self-end rounded-2xl border p-1.5 shadow-xl"
		>
			{groups.map((group, index) => (
				<Fragment key={index}>
					{index > 0 && (
						<m.div
							role="separator"
							variants={actionItemVariants}
							className="bg-outline/15 mx-2 my-1 h-px"
						/>
					)}

					{group.map(({ key, ...action }) => (
						<RequestCardActionItem key={key} {...action} />
					))}
				</Fragment>
			))}
		</m.div>
	)
}
