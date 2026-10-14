import type { DragControls, PanInfo } from "motion/react";
import type { PropsWithChildren, RefObject } from "react";

export interface BottomSheetProps extends PropsWithChildren {
	open: boolean
	onChange: (isOpen: boolean) => void

	zIndex?: number
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

	/** Разрешить регистрацию перетаскивания по всему контенту */
	dragAnywhere?: boolean

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

	expandable?: boolean
	expanded?: boolean
	defaultExpanded?: boolean
	onExpandedChange?: (expanded: boolean) => void
	expandedHeight?: number | string
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
	title?: string
	titleId: string
	titleCN?: string
	className?: string
	panelCN?: string
	indicator: boolean
	indicatorCN?: string
	dragToClose: boolean
	dragAnywhere: boolean
	dismissThreshold: number
	reducedMotion: boolean
	onClose: () => void
	children: React.ReactNode
	panelRef: RefObject<HTMLDivElement | null>
	expandable: boolean
	expanded: boolean
	expandedHeight: number | string
	onExpandedChange: (expanded: boolean) => void
}

export type BottomSheetDragEndHandler = (
	event: MouseEvent | TouchEvent | PointerEvent,
	info: PanInfo
) => void
