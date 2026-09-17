import type { Metadata } from "next"

import { RegisterScreen } from "@/components/screens/register/register"
import { NO_INDEX_PAGE } from "@/libs/constants"

export const metadata: Metadata = {
	title: "Регистрация | CascadePro",
	description: "",
	...NO_INDEX_PAGE
}

export default function Register() {
	return <RegisterScreen />
}
