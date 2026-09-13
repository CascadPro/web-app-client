export type HapticType = "light" | "medium" | "heavy"

const patterns: Record<HapticType, number | number[]> = {
	light: 10,
	medium: 20,
	heavy: 35
}

const sounds: Record<HapticType, string> = {
	light: "/sounds/haptic-light.mp3",
	medium: "/sounds/haptic-medium.mp3",
	heavy: "/sounds/haptic-heavy.mp3"
}

const audioCache = new Map<HapticType, HTMLAudioElement>()

const isIOS = () => {
	if (typeof window === "undefined") return false

	return (
		/iPad|iPhone|iPod/.test(navigator.userAgent) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	)
}

const getAudio = (type: HapticType) => {
	let audio = audioCache.get(type)

	if (!audio) {
		audio = new Audio(sounds[type])

		audio.preload = "auto"
		audio.volume = 0.2

		audioCache.set(type, audio)
	}

	return audio
}

export const preloadHaptic = () => {
	if (typeof window === "undefined") return

	// На Android это не нужно
	if (!isIOS()) return

	for (const type of Object.keys(sounds) as HapticType[]) {
		const audio = getAudio(type)

		audio.load()
	}
}

export const haptic = (type: HapticType = "light") => {
	if (typeof window === "undefined") return

	const pattern = patterns[type]

	if ("vibrate" in navigator) {
		try {
			navigator.vibrate(pattern)
			return
		} catch {
			console.error("Failed to vibrate", pattern)
		}
	}

	if (isIOS()) {
		const audio = getAudio(type)

		audio.currentTime = 0

		void audio.play().catch(() => {
			console.error("Failed to play haptic", type)
		})
	}
}
