import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui"

export const RequestCreateButton = () => {
	return (
		<Button
			variant="tertiary"
			title="Создать заявку"
			className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-3 z-50 rounded-xl p-2 active:rounded-3xl"
		>
			<PlusIcon size={28} />
		</Button>
	)
}
