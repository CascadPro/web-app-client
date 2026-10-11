import { useEffect } from "react"

let lockCount = 0

const lockBody = () => {
	lockCount += 1

	if (lockCount > 0) {
		document.body.dataset["scrollLocked"] = String(lockCount)
	}
}

const unlockBody = () => {
	lockCount = Math.max(0, lockCount - 1)

	if (lockCount === 0) {
		delete document.body.dataset["scrollLocked"]
	}
}

export const useScrollLocked = (enabled: boolean) => {
	useEffect(() => {
		if (!enabled) return

		lockBody()

		return unlockBody
	}, [enabled])
}
