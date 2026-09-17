import type { Metadata } from "next"

import { Title } from "@/components/ui"

export const metadata: Metadata = {
	title: "О нас | CascadePro",
	description:
		'Страница "О нас" рассказывающая о компании CascadePro, а также её продукте CascadePro App'
}

export default function About() {
	return <Title size="lg">О нас</Title>
}
