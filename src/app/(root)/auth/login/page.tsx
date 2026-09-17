import type { Metadata } from "next"

import { LoginScreen } from "@/components/screens/login/login"
import { NO_INDEX_PAGE } from "@/libs/constants"

export const metadata: Metadata = {
	title: "Вход в систему | CascadePro",
	description: "",
	...NO_INDEX_PAGE
}

export default function Login() {
	return <LoginScreen />
}
