import { InboxIcon } from "lucide-react"
import { m } from "motion/react"

export const RequestEmpty = () => {
	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="border-outline/20 flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-8 text-center"
		>
			<div className="bg-surface rounded-2xl p-4">
				<InboxIcon className="text-on-surface-variant size-6" />
			</div>

			<h3 className="text-on-surface font-medium">Заявок пока нет</h3>

			<p className="text-on-surface-variant text-sm">
				Попробуйте изменить фильтры или создайте новую заявку
			</p>
		</m.div>
	)
}
