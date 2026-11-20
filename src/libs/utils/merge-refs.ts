import type { MutableRefObject, Ref, RefCallback } from "react"

/** Объединяет несколько ref в один (важно: результат нужно мемоизировать) */
export const mergeRefs =
	<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> =>
	node => {
		for (const ref of refs) {
			if (typeof ref === "function") ref(node)
			else if (ref) (ref as MutableRefObject<T | null>).current = node
		}
	}
