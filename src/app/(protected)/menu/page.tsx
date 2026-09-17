import type { Metadata } from "next"

import { MenuScreen } from "@/components/screens/menu/menu"

export const metadata: Metadata = {
	title: "Меню | CascadePro"
}

export default function Menu() {
	return <MenuScreen />
}
