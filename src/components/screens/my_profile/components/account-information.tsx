import { CalendarDaysIcon, ShieldIcon } from "lucide-react"
import { m } from "motion/react"
import type { FC } from "react"

import type { DomainUserRole } from "@/api/generated"
import { Title } from "@/components/ui"
import { formatDate, roleName } from "@/libs/utils"

import { ProfileRow } from "./profile-row"

interface Props {
	role?: DomainUserRole
	last_active_at?: string | null
}

export const AccountInformation: FC<Props> = ({ role, last_active_at }) => {
	return (
		<m.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.1 }}
			className="border-outline/20 bg-surface overflow-hidden rounded-3xl border shadow-sm"
		>
			<div className="border-outline/15 border-b px-5 py-4 sm:px-6">
				<Title size="sm" className="text-on-surface">
					Аккаунт
				</Title>

				<p className="text-on-surface-variant mt-1 text-sm">
					Аккаунт и ваша активность
				</p>
			</div>

			<div className="divide-outline/10 divide-y">
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
			</div>
		</m.section>
	)
}
