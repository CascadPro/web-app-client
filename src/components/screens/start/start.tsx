import { Button, Separator, Title } from "@/components/ui"
import { AppRoutes } from "@/libs/constants"

export const StartPage = () => {
	return (
		<>
			<Title size="lg">Начать работу</Title>

			<div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center gap-4 px-5">
				<Button
					variant="default"
					href={AppRoutes.LOGIN}
					className="w-full rounded-full py-3"
				>
					Войти в систему
				</Button>

				<div className="flex w-full items-center gap-1">
					<Separator type="horizontal" />

					<span>или</span>

					<Separator type="horizontal" />
				</div>

				<Button
					variant="outline"
					href={AppRoutes.REGISTER}
					className="w-full rounded-full py-3"
				>
					Пройти регистрацию
				</Button>
			</div>
		</>
	)
}
