import { type FC, memo } from "react"

import { Button } from "@/components/ui"

interface Props {
	refresh: () => void
}

const ProfileErrorComponent: FC<Props> = ({ refresh }) => {
	return (
		<main className="mx-auto w-full max-w-3xl px-1 sm:px-6">
			<div className="border-outline/20 bg-surface flex flex-col items-center gap-3 rounded-3xl border p-6 text-center">
				<p className="text-on-surface font-medium">
					Не удалось загрузить профиль
				</p>

				<p className="text-on-surface-variant text-sm">
					Проверь подключение и попробуй ещё раз.
				</p>

				<Button onClick={refresh} variant="outline">
					Повторить
				</Button>
			</div>
		</main>
	)
}

export const ProfileError = memo(ProfileErrorComponent)
ProfileError.displayName = "ProfileError"
