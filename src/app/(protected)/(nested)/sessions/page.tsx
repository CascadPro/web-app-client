import type { Metadata } from "next"

import { SessionsScreen } from "@/components/screens/sessions/sessions"

export const metadata: Metadata = {
	title: "Сеансы | CascadePro"
}

export default function Sessions() {
	return <SessionsScreen />
}
