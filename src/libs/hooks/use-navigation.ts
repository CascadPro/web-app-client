import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter } from "next/navigation"

export function startNavigationProgress() {
	if (typeof window === "undefined") return

	window.dispatchEvent(new Event("cascade:navigation-start"))
}

export const useNavigation = () => {
	const { back, forward, push, replace, ...other } = useRouter()

	const backFn = () => {
		startNavigationProgress()
		back()
	}

	const forwardFn = () => {
		startNavigationProgress()
		forward()
	}

	const pushFn = (href: string, options?: NavigateOptions | undefined) => {
		startNavigationProgress()
		push(href, options)
	}

	const replaceFn = (href: string, options?: NavigateOptions | undefined) => {
		startNavigationProgress()
		replace(href, options)
	}

	return {
		back: backFn,
		forward: forwardFn,
		push: pushFn,
		replace: replaceFn,
		...other
	}
}
