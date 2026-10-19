"use client"

import { AnimatePresence, m } from "motion/react"
import Image from "next/image"
import { type FC, memo, type PropsWithChildren } from "react"

import { Title } from "../ui"

import { usePWASplashScreen } from "./hooks/usePWASplashScreen"

interface Props extends PropsWithChildren {}

const PWASplashScreenComponent: FC<Props> = ({ children }) => {
	const { reduceMotion, dismissed } = usePWASplashScreen()

	return (
		<>
			{children}

			<AnimatePresence>
				{!dismissed && (
					<m.div
						key="app-splash"
						initial={false}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: reduceMotion ? 0 : 0.22,
							ease: "easeOut"
						}}
						className="bg-background text-on-background fixed inset-0 z-9999 flex items-center justify-center"
						style={{
							paddingTop: "var(--safe-area-top)",
							paddingRight: "var(--safe-area-right)",
							paddingBottom: "var(--safe-area-bottom)",
							paddingLeft: "var(--safe-area-left)"
						}}
						role="status"
						aria-live="polite"
						aria-label="Загрузка Cascade Pro"
					>
						<div className="flex flex-col items-center gap-3">
							<div className="bg-surface ring-outline/20 relative flex size-20 items-center justify-center rounded-[1.75rem] shadow-xl ring">
								<Image
									src="/icons/icon-512.png"
									alt="Cascade Pro логотип"
									width={100}
									height={100}
									loading="eager"
								/>

								<span className="bg-background absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full">
									<span className="bg-primary size-3 animate-ping rounded-full motion-reduce:animate-none" />
									<span className="bg-primary absolute size-3 rounded-full" />
								</span>
							</div>

							<div className="flex flex-col items-center gap-3">
								<Title size="xl" className="text-3xl tracking-wide">
									Cascade Pro
								</Title>

								<div className="bg-surface-variant h-1 w-20 overflow-hidden rounded-full">
									<div className="bg-primary h-full w-1/2 animate-ping rounded-full motion-reduce:animate-none" />
								</div>
							</div>
						</div>
					</m.div>
				)}
			</AnimatePresence>
		</>
	)
}

export const PWASplashScreen = memo(PWASplashScreenComponent)
PWASplashScreen.displayName = "PWASplashScreen"
