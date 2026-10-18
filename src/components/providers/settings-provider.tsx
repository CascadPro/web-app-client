"use client"

import { MotionConfig } from "motion/react"
import {
	createContext,
	type FC,
	type PropsWithChildren,
	useContext
} from "react"

import { SettingsContextValue } from "@/types/screens/settings"

import { useSettingsProvider } from "./hooks/useSettingsProvider"

const SettingsContext = createContext<SettingsContextValue | null>(null)

export const SettingsContextProvider: FC<PropsWithChildren> = ({
	children
}) => {
	const { contextValue, reduceMotion } = useSettingsProvider()

	return (
		<SettingsContext.Provider value={contextValue}>
			<MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
				{children}
			</MotionConfig>
		</SettingsContext.Provider>
	)
}

export const useSettingsContext = () => {
	const context = useContext(SettingsContext)

	if (!context) {
		throw new Error(
			"useSettingsContext must be used inside SettingsContextProvider"
		)
	}

	return context
}
