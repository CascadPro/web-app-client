import { InfoIcon, MailIcon, UserRoundIcon } from "lucide-react"
import { type FC, memo } from "react"

import { ProfileRow } from "../profile-row"
import { ProfileSection } from "../profile-section"

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
		<ProfileSection
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
		</ProfileSection>
	)
}

export const ProfileInformation = memo(ProfileInformationComponent)
ProfileInformation.displayName = "ProfileInformation"
