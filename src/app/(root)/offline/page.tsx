import type { Metadata } from "next"

import { OfflineScreen } from "@/components/screens/offline/offline"
import { NO_INDEX_PAGE } from "@/libs/constants"

export const dynamic = "force-static"

export const metadata: Metadata = {
	title: "Нет подключения | Cascade Pro",
	description: "Проверьте подключение к интернету и повторите попытку.",
	...NO_INDEX_PAGE
}

export default function OfflinePage() {
	return <OfflineScreen />
}
