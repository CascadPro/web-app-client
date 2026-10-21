import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { usePathname, useRouter } from "next/navigation"

export function startNavigationProgress() {
	if (typeof window === "undefined") return

	window.dispatchEvent(new Event("cascade:navigation-start"))
}

export const useNavigation = () => {
	const pathname = usePathname()

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
		if (pathname !== href) startNavigationProgress()
		push(href, options)
	}

	const replaceFn = (href: string, options?: NavigateOptions | undefined) => {
		if (pathname !== href) startNavigationProgress()
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
