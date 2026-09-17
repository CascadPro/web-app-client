import type { Metadata } from "next"

import { StartScreen } from "@/components/screens/start/start"
import { NO_INDEX_PAGE } from "@/libs/constants"

export const metadata: Metadata = {
	title: "Начать работу | CascadePro",
	description: "",
	...NO_INDEX_PAGE
}

export default function Start() {
	return <StartScreen />
}
