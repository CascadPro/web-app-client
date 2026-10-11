import type { Metadata } from "next"

import { RequestsScreen } from "@/components/screens/requests/requests"
import { RequestContextProvider } from "@/components/screens/requests/requests-context"

export const metadata: Metadata = {
	title: "Входящие заявки | CascadePro"
}

export default function Requests() {
	return (
		<RequestContextProvider>
			<RequestsScreen />
		</RequestContextProvider>
	)
}
