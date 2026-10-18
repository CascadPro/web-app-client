"use client"

import { useIsRestoring } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { type PropsWithChildren, useEffect } from "react"

import { queryClient } from "@/libs/query/client"
import { queryPersister } from "@/libs/query/persister"
import { ms } from "@/libs/utils"
import { useAppReadinessStore } from "@/store/app-readiness"

function QueryRestorationSignal() {
	const isRestoring = useIsRestoring()
	const setQueryRestored = useAppReadinessStore(state => state.setQueryRestored)

	useEffect(() => {
		if (!isRestoring) {
			setQueryRestored()
		}
	}, [isRestoring, setQueryRestored])

	return null
}

const persistOptions = {
	persister: queryPersister,
	maxAge: ms("1d")
}

export function QueryProvider({ children }: Readonly<PropsWithChildren>) {
	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={persistOptions}
		>
			<QueryRestorationSignal />
			{children}
		</PersistQueryClientProvider>
	)
}
