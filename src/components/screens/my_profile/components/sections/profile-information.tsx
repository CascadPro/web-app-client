import { InfoIcon, MailIcon, UserRoundIcon } from "lucide-react"
import { type FC, memo } from "react"

import { Section } from "@/components/ui"

import { ProfileRow } from "../profile-row"

interface Props {
	name?: string
	surname?: string
	last_name?: string
	email?: string
}

const ProfileInformationComponent: FC<Props> = ({
	name,
	surname,
	last_name,
	email
}) => {
	return (
		<Section
			id="information"
			title="Персональная информация"
			description="Ваша основная информация"
			icon={InfoIcon}
		>
			<ProfileRow icon={<UserRoundIcon />} label="Имя" value={name || "—"} />

			<ProfileRow
				icon={<UserRoundIcon />}
				label="Фамилия"
				value={surname || "—"}
			/>

			<ProfileRow
				icon={<UserRoundIcon />}
				label="Отчество"
				value={last_name || "—"}
			/>

			<ProfileRow
				icon={<MailIcon />}
				label="Электронная почта"
				value={email || "—"}
			/>
		</Section>
	)
}

export const ProfileInformation = memo(ProfileInformationComponent)
ProfileInformation.displayName = "ProfileInformation"
