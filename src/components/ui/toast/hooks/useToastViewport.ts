import { useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

import { toast } from "../toast"
import type { ToastData, ToastPosition } from "../types"

export const useToastViewport = () => {
	const [items, setItems] = useState<ToastData[]>([])
	const reduceMotion = useReducedMotion()

	useEffect(() => toast.subscribe(setItems), [])

	const groups = new Map<ToastPosition, ToastData[]>()

	for (const item of items) {
		const position = item.position ?? "top-center"
		const group = groups.get(position) ?? []

		group.push(item)
		groups.set(position, group)
	}

	return {
		groups,
		reduceMotion
	}
}
