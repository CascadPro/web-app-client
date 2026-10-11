"use client"

import {
	createContext,
	type FC,
	type PropsWithChildren,
	useContext
} from "react"

import type { RequestContextState } from "@/types/screens/requests"

import { useRequestContextProvider } from "./hooks/useRequestContext"

const RequestContext = createContext<RequestContextState>({
	statuses: [],
	sortType: "newest",
	isClearDisabled: true,

	setStatuses: () => {},
	setSortType: () => {},
	clearFilters: () => {}
})

export const RequestContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const { values } = useRequestContextProvider()

	return (
		<RequestContext.Provider value={values}>{children}</RequestContext.Provider>
	)
}

export const useRequestContext = () => {
	return useContext(RequestContext)
}
