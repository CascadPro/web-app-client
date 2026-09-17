"use client"

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { type PropsWithChildren } from "react";

import { queryClient } from "@/libs/query/client"
import { queryPersister } from "@/libs/query/persister"
import { ms } from "@/libs/utils";

export function QueryProvider({ children }: PropsWithChildren) {
	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister: queryPersister,
				maxAge: ms("1d")
			}}
		>
			{children}
		</PersistQueryClientProvider>
	)
}
