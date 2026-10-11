import { AlertCircleIcon } from "lucide-react"

export const SessionError = () => {
	return (
		<div className="border-outline/20 bg-surface flex flex-col items-center gap-3 rounded-2xl border px-6 py-12 text-center">
			<AlertCircleIcon className="text-destructive size-8" />

			<p className="text-on-surface font-medium">Не удалось загрузить сеансы</p>

			<p className="text-on-surface-variant max-w-md text-sm">
				{"Попробуйте обновить страницу"}
			</p>
		</div>
	)
}
