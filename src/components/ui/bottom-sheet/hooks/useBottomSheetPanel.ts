import {
	PanInfo,
	useDragControls,
	useMotionValue,
	useSpring
} from "motion/react"
import { useRef, useState } from "react"

export const useBottomSheetPanel = (
	dismissThreshold: number,
	dragToClose: boolean,
	dragAnywhere: boolean,
	expanded: boolean,
	expandable: boolean,
	onClose: () => void,
	onExpandedChange: (state: boolean) => void
) => {
	const contentRef = useRef<HTMLDivElement>(null)

	const dragControls = useDragControls()

	const rubberScaleValue = useMotionValue(1)

	const rubberScale = useSpring(rubberScaleValue, {
		stiffness: 400,
		damping: 28
	})

	const [dragHeight, setDragHeight] = useState<number | null>(null)
	const dragStartHeight = useRef(0)

	const handleDragEnd = (
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		const deltaY = info.offset.y

		// Свайп вверх — расширяем
		if (deltaY < -60 && expandable && !expanded) {
			onExpandedChange(true)
			return
		}

		// Свайп вниз — сначала сворачиваем
		if (deltaY > 60 && expanded) {
			onExpandedChange(false)
			return
		}

		if (!dragToClose) return

		const shouldClose =
			info.offset.y > dismissThreshold ||
			(info.offset.y > 30 && info.velocity.y > 700)

		if (shouldClose) {
			onClose()
		}
	}

	const handleDragEndWithHeight = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		setDragHeight(null)
		rubberScaleValue.set(1)
		handleDragEnd(event, info)
	}

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!dragAnywhere || !dragToClose) return

		const target = event.target

		if (
			target instanceof Element &&
			target.closest(
				"button, a, input, textarea, select, " +
					'[contenteditable="true"], [data-no-drag]'
			)
		) {
			return
		}

		const content = contentRef.current
		if (!content || content.scrollTop > 0) return

		dragControls.start(event.nativeEvent)
	}

	return {
		contentRef,
		dragControls,
		expanded,
		rubberScaleValue,
		rubberScale,
		dragHeight,
		dragStartHeight,
		setDragHeight,
		handleDragEndWithHeight,
		handlePointerDown
	}
}
