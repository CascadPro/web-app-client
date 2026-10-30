"use client"

import { useReducedMotion } from "motion/react"
import { createContext, useContext } from "react"

/**
 * Значение, которое задаёт SettingsContextProvider (настройка «Анимации»).
 * `null` — провайдера нет (публичные страницы), берём системную настройку.
 */
const MotionPreferenceContext = createContext<boolean | null>(null)

export const MotionPreferenceProvider = MotionPreferenceContext.Provider

/**
 * Единый источник правды для «уменьшить анимации».
 * Приоритет: настройка приложения → системный prefers-reduced-motion.
 */
export const useReduceMotion = (): boolean => {
	const system = useReducedMotion()
	const override = useContext(MotionPreferenceContext)

	return override ?? Boolean(system)
}
