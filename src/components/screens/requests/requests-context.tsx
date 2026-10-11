"use client"

import {
	createContext,
	type FC,
	type PropsWithChildren,
	useContext
} from "react"

import { useRequestContextProvider } from "./hooks/useRequestContext"
import type { RequestContextState } from "./libs"

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
