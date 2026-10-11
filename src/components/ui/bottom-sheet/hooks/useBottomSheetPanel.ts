import { PanInfo, useDragControls } from "motion/react"
import { useRef } from "react"

export const useBottomSheetPanel = (
	dismissThreshold: number,
	dragToClose: boolean,
	dragAnywhere: boolean,
	onClose: () => void
) => {
	const contentRef = useRef<HTMLDivElement>(null)

	const dragControls = useDragControls()

	const handleDragEnd = (
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo
	) => {
		if (!dragToClose) return

		const shouldClose =
			info.offset.y > dismissThreshold ||
			(info.offset.y > 30 && info.velocity.y > 700)

		if (shouldClose) {
			onClose()
		}
	}

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!dragAnywhere || !dragToClose) return

		const content = contentRef.current

		if (!content) return

		if (content.scrollTop > 0) return

		dragControls.start(event.nativeEvent)
	}

	return {
		contentRef,
		dragControls,
		handleDragEnd,
		handlePointerDown
	}
}
