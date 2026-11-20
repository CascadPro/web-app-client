"use client"

import type { LucideIcon } from "lucide-react"
import { AnimatePresence, m } from "motion/react"
import type { FC } from "react"

import { Button } from "@/components/ui"
import { DURATION, EASE_OUT } from "@/libs/motion"
import type { RequestCreateStatus } from "@/types/screens/requests"

import { RequestFormSubmit } from "./request-form-submit"

interface Props {
	status: RequestCreateStatus
	formId: string
	submitLabels: Record<RequestCreateStatus, string>
	submitIcon?: LucideIcon
	submitDisabled?: boolean
	canReset: boolean
	resetLabel: string
	resetIcon: LucideIcon
	onReset: () => void
}

export const RequestFormFooter: FC<Props> = ({
	status,
	formId,
	submitLabels,
	submitIcon,
	submitDisabled,
	canReset,
	resetLabel,
	resetIcon: ResetIcon,
	onReset
}) => (
	<div className="flex items-center">
		<AnimatePresence initial={false}>
			{canReset && (
				<m.div
					key="reset"
					initial={{ opacity: 0, width: 0, marginRight: 0 }}
					animate={{ opacity: 1, width: "auto", marginRight: 12 }}
					exit={{ opacity: 0, width: 0, marginRight: 0 }}
					transition={{ duration: DURATION.base, ease: EASE_OUT }}
					className="shrink-0 overflow-hidden"
				>
					<Button
						variant="destructive-outline"
						className="p-3"
						title={resetLabel}
						aria-label={resetLabel}
						onClick={onReset}
					>
						<ResetIcon size={18} />
					</Button>
				</m.div>
			)}
		</AnimatePresence>

		<RequestFormSubmit
			status={status}
			formId={formId}
			labels={submitLabels}
			idleIcon={submitIcon}
			disabled={submitDisabled}
		/>
	</div>
)
