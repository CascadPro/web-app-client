import { useEffect, useMemo, useState } from "react"

import { useRealtimeStore } from "@/store/realtime"

import { STATUS_CONFIG } from "./data"

export const useRealtimeIndicator = () => {
	const status = useRealtimeStore(state => state.status)
	const metrics = useRealtimeStore(state => state.metrics)
	const lastError = useRealtimeStore(state => state.lastError)
	const reconnectAttempt = useRealtimeStore(state => state.reconnectAttempt)

	const [visible, setVisible] = useState(false)
	const [collapsed, setCollapsed] = useState(false)

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
		}

		if (status === "reconnecting") {
			return `Попытка ${reconnectAttempt}`
		}

		if (status === "error" && lastError) {
			return lastError
		}

		return config.description
	}, [
		status,
		lastError,
		reconnectAttempt,
		metrics.quality,
		metrics.rtt,
		config.description
	])

	useEffect(() => {
		if (status === "idle") {
			setVisible(false)
			setCollapsed(false)
			return
		}

		setVisible(true)

		if (status !== "online") {
			setCollapsed(false)
			return
		}

		setCollapsed(false)

		const timer = setTimeout(() => {
			setCollapsed(true)
		}, 5_000)

		return () => clearTimeout(timer)
	}, [status])

	return {
		visible,
		collapsed,
		setCollapsed,
		config,
		Icon,
		status,
		quality: metrics.quality,
		description
	}
}
