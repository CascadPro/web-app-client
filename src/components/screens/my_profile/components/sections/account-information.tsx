import { CalendarDaysIcon, ShieldIcon, User2Icon } from "lucide-react"
import { type FC, memo } from "react"

import type { DomainUserRole } from "@/api/generated"
import { Section } from "@/components/ui"
import { formatDate, roleName } from "@/libs/utils"

import { ProfileRow } from "../profile-row"

interface Props {
	role?: DomainUserRole
	last_active_at?: string | null
}

const AccountInformationComponent: FC<Props> = ({ role, last_active_at }) => {
	return (
		<Section
			id="account"
			title="Аккаунт"
			description="Аккаунт и ваша активность"
			icon={User2Icon}
		>
			<ProfileRow
				icon={<ShieldIcon />}
				label="Роль"
				value={role ? roleName(role) : "—"}
			/>

			<ProfileRow
				icon={<CalendarDaysIcon />}
				label="Последняя активность"
				value={formatDate(last_active_at)}
			/>
		</Section>
	)
}

export const AccountInformation = memo(AccountInformationComponent)
AccountInformation.displayName = "AccountInformation"
