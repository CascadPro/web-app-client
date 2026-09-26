import { useEffect, useState } from "react"

import { useRealtimeStore } from "@/store/realtime"

import { STATUS_CONFIG } from "./data"

export const useRealtimeIndicator = () => {
	const status = useRealtimeStore(state => state.status)
	const lastError = useRealtimeStore(state => state.lastError)
	const reconnectAttempt = useRealtimeStore(state => state.reconnectAttempt)

	const [visible, setVisible] = useState(false)

	const config = STATUS_CONFIG[status]
	const Icon = config.icon

	useEffect(() => {
		if (status === "idle") {
			setVisible(false)
			return
		}

		if (status === "online") {
			setVisible(true)

			const timer = setTimeout(() => {
				setVisible(false)
			}, 3000)

			return () => clearTimeout(timer)
		}

		setVisible(true)
	}, [status])

	return {
		lastError,
		reconnectAttempt,
		visible,
		config,
		Icon,
		status
	}
}
