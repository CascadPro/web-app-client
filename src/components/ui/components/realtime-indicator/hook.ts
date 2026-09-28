import { useEffect, useMemo, useState } from "react"

import { useRealtimeStore } from "@/store/realtime"

import { STATUS_CONFIG } from "./data"

export const useRealtimeIndicator = () => {
	const status = useRealtimeStore(state => state.status)
	const metrics = useRealtimeStore(state => state.metrics)
	const lastError = useRealtimeStore(state => state.lastError)
	const reconnectAttempt = useRealtimeStore(state => state.reconnectAttempt)

	const [visible, setVisible] = useState(false)

	const config = STATUS_CONFIG[status]
	const Icon = config.icon

	const description = useMemo(() => {
		if (status === "online") {
			switch (metrics.quality) {
				case "good":
					return `Хорошее соединение · ${Math.round(metrics.rtt ?? 0)} мс`
				case "degraded":
					return `Задержка сети · ${Math.round(metrics.rtt ?? 0)} мс`
				case "poor":
					return `Плохое соединение · ${Math.round(metrics.rtt ?? 0)} мс`
				default:
					return "Проверяем качество соединения"
			}
		} else if (status === "reconnecting") {
			return `Попытка ${reconnectAttempt}`
		} else if (status === "error" && lastError) {
			return lastError
		} else {
			return config.description
		}
	}, [status, lastError, reconnectAttempt, metrics.quality, metrics.rtt])

	useEffect(() => {
		if (status === "idle") {
			setVisible(false)
			return
		}

		if (status === "online") {
			setVisible(true)

			const timer = setTimeout(() => {
				setVisible(false)
			}, 10000)

			return () => clearTimeout(timer)
		}

		setVisible(true)
	}, [status])

	return {
		visible,
		config,
		Icon,
		status,
		description
	}
}
