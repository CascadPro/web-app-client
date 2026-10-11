import { useEffect, useState } from "react"

export function useHash() {
	const [hash, setHash] = useState("")

	useEffect(() => {
		const updateHash = () => {
			setHash(window.location.hash.slice(1))
		}

		updateHash()
		window.addEventListener("hashchange", updateHash)

		return () => {
			window.removeEventListener("hashchange", updateHash)
		}
	}, [])

	return hash
}
