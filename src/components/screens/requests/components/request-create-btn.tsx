import { PlusIcon } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui";

const RequestCreateButtonComponent = () => {
	return (
		<Button
			variant="secondary"
			title="Создать заявку"
			className="fixed top-[calc(env(safe-area-inset-bottom)+5rem)] right-3 z-50 rounded-xl p-2 active:rounded-3xl"
		>
			<PlusIcon size={28} />
		</Button>
	)
}

export const RequestCreateButton = memo(RequestCreateButtonComponent)
