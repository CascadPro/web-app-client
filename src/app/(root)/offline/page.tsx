import type { Metadata } from "next"

import { OfflineScreen } from "@/components/screens/offline/offline"
import { NO_INDEX_PAGE } from "@/libs/constants"

export const metadata: Metadata = {
	title: "Оффлайн режим | CascadePro",
	description: "",
	...NO_INDEX_PAGE
}

export default function Offline() {
	return <OfflineScreen />
}
