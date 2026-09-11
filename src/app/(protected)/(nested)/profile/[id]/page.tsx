import { redirect, RedirectType } from "next/navigation"
import { uuidv4 } from "zod"

import { MyProfilePage } from "@/components/screens/my_profile/profile"

interface Props {
	params: Promise<{ id: string }>
}

export default async function Profile(props: Props) {
	const { id } = await props.params

	if (id === "me") return <MyProfilePage />
	else if (uuidv4().parse(id)) return <></>
	else return redirect("/not-found", RedirectType.replace)
}
