import type { Metadata } from "next"

import { RequestsScreen } from "@/components/screens/requests/requests"

export const metadata: Metadata = {
	title: "Входящие заявки | CascadePro"
}

export default function Requests() {
	return <RequestsScreen />
}
