"use client"

import { memo } from "react"

import { Button, Separator, Stagger, StaggerItem, Title } from "@/components/ui"
import { AppRoutes } from "@/libs/constants"

const StartScreenComponent = () => {
	return (
		<>
			<Title size="lg">Начать работу</Title>

			<Stagger
				className="absolute -top-4 left-0 flex h-full w-full flex-col items-center justify-center gap-4 px-5"
				stagger={0.08}
				delay={0.05}
			>
				<StaggerItem className="w-full">
					<Button
						variant="default"
						href={AppRoutes.LOGIN}
						className="w-full rounded-full py-3"
					>
						Войти в систему
					</Button>
				</StaggerItem>

				<StaggerItem className="flex w-full items-center gap-1">
					<Separator type="horizontal" />

					<span>или</span>

					<Separator type="horizontal" />
				</StaggerItem>

				<StaggerItem className="w-full">
					<Button
						variant="outline"
						href={AppRoutes.REGISTER}
						className="w-full rounded-full py-3"
					>
						Пройти регистрацию
					</Button>
				</StaggerItem>
			</Stagger>
		</>
	)
}

export const StartScreen = memo(StartScreenComponent)
StartScreen.displayName = "StartScreen"
