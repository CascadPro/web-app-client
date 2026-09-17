import type { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import { uuidv4 } from "zod"

import { MyProfileScreen } from "@/components/screens/my_profile/profile"

interface Props {
	params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const { id } = await props.params

	return {
		title: `${id === "me" ? "Ваш профиль" : "Профиль пользователя"} | CascadePro`
	}
}

export default async function Profile(props: Readonly<Props>) {
	const { id } = await props.params

	if (id === "me") return <MyProfileScreen />
	else if (uuidv4().parse(id)) return <></>
	else return redirect("/not-found", RedirectType.replace)
}
