import { MailIcon, UserRoundIcon } from "lucide-react"
import { m } from "motion/react"
import type { FC } from "react"

import { Title } from "@/components/ui"

import { ProfileRow } from "./profile-row"

interface Props {
	name?: string
	surname?: string
	last_name?: string
	email?: string
}

export const ProfileInformation: FC<Props> = ({
	name,
	surname,
	last_name,
	email
}) => {
	return (
		<m.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: 0.05 }}
			className="border-outline/20 bg-surface overflow-hidden rounded-3xl border shadow-sm"
		>
			<div className="border-outline/15 border-b px-5 py-4 sm:px-6">
				<Title size="sm" className="text-on-surface">
					Персональная информация
				</Title>

				<p className="text-on-surface-variant mt-1 text-sm">
					Ваша основная информация
				</p>
			</div>

			<div className="divide-outline/10 divide-y">
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
			</div>
		</m.section>
	)
}
