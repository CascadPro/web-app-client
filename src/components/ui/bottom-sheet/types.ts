import type { DragControls, PanInfo } from "motion/react"
import type { PropsWithChildren, RefObject } from "react"

export interface BottomSheetProps extends PropsWithChildren {
	open: boolean
	onChange: (isOpen: boolean) => void

	zIndex?: number
	offset?: number
	className?: string

	title?: string
	titleCN?: string

	indicator?: boolean
	indicatorCN?: string

	/** Закрывать при нажатии на фон. */
	closeOnBackdropClick?: boolean

	/** Закрывать по Escape. */
	closeOnEscape?: boolean

	/** Разрешить закрытие перетаскиванием вниз. */
	dragToClose?: boolean

	/** Порог закрытия в пикселях. */
	dismissThreshold?: number

	/** Показывать затемнение фона. */
	showBackdrop?: boolean

	/** Не размонтировать содержимое после первого открытия. */
	keepMounted?: boolean

	/** Дополнительный класс панели. */
	panelCN?: string

	/** Дополнительный класс затемнения. */
	backdropCN?: string
}

export interface BottomSheetBackdropProps {
	className?: string
	onClick: () => void
}

export interface BottomSheetHandleProps {
	visible: boolean
	className?: string
	dragControls: DragControls
	onClose: () => void
}

export interface BottomSheetPanelProps {
	open: boolean
	offset: number
	title?: string
	titleId: string
	titleCN?: string
	className?: string
	panelCN?: string
	indicator: boolean
	indicatorCN?: string
	dragToClose: boolean
	dismissThreshold: number
	reducedMotion: boolean
	onClose: () => void
	children: React.ReactNode
	panelRef: RefObject<HTMLDivElement | null>
}

export type BottomSheetDragEndHandler = (
	event: MouseEvent | TouchEvent | PointerEvent,
	info: PanInfo
) => void
