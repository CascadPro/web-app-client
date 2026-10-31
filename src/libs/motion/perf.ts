"use client"

import { useSyncExternalStore } from "react"

import { DESIGN } from "@/libs/design/config"

const subscribe = () => () => {}

const getSnapshot = () => document.documentElement.dataset.perf === "low"

/**
 * true — слабое устройство (определяется boot-скриптом, см. libs/design/boot.ts).
 * Значение не меняется за сессию, поэтому подписка не нужна.
 * На сервере и при гидратации — false (полный режим), без рассинхронизации разметки.
 */
export const useLowPerf = (): boolean =>
	useSyncExternalStore(subscribe, getSnapshot, () => false)

/** Множитель длительности: 1 — обычно, <1 — слабое устройство */
export const useMotionScale = (): number =>
	useLowPerf() ? DESIGN.motion.liteScale : 1
