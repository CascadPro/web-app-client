"use client"

import { LogOutIcon } from "lucide-react"

import {
	Button,
	Container,
	Separator,
	Stagger,
	StaggerItem
} from "@/components/ui"

import { MenuItem } from "./components/menu-item"
import { ProfileBadge } from "./components/profile-badge"
import { MENU_ITEMS_DATA } from "./data"
import { useMenuPage } from "./hooks/useMenuPage"

export const MenuScreen = () => {
	const { fullname, user, loading, logout } = useMenuPage()

	return (
		<Container className="pwa:pt-5 max-w-3xl px-3 py-3">
			<ProfileBadge
				fullname={fullname}
				role={user?.role ?? ""}
				avatarUrl={user?.avatar_file_id}
				avatarHash={user?.avatar_placeholder}
				loading={loading}
			/>

			<Stagger
				className="mt-10 flex flex-col gap-5"
				stagger={0.045}
				delay={0.05}
			>
				{MENU_ITEMS_DATA.map(item => (
					<StaggerItem key={String(item.href)}>
						<MenuItem item={item} />
					</StaggerItem>
				))}

				<Separator type="horizontal" className="bg-secondary my-4" />

				<StaggerItem>
					<Button
						variant="destructive-outline"
						className="w-full items-center justify-start gap-2 p-3"
						onClick={logout}
					>
						<LogOutIcon size={24} />
						Выйти из системы
					</Button>
				</StaggerItem>
			</Stagger>
		</Container>
	)
}
