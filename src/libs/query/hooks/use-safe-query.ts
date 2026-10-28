import {
	useMutation,
	type UseMutationOptions,
	useQuery,
	type UseQueryOptions
} from "@tanstack/react-query"

import { ms } from "@/libs/utils"

/**
 * Default query options applied to all queries created through useSafeQuery.
 * Reduces duplication and ensures consistent caching behavior.
 */
const DEFAULT_QUERY_OPTIONS = {
	staleTime: ms("5min"),
	gcTime: ms("15min"),
	placeholderData: <T>(previous: T | undefined) => previous,
	refetchOnReconnect: true
} satisfies Partial<UseQueryOptions>

/**
 * Default mutation options applied to all mutations created through useSafeMutation.
 */
const DEFAULT_MUTATION_OPTIONS = {
	retry: false
} satisfies Partial<UseMutationOptions>

/**
 * Wrapper around useQuery that applies default options.
 * Use this instead of raw useQuery to ensure consistent behavior across the app.
 */
export function useSafeQuery<
	TQueryFnData,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends unknown[] = unknown[]
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
	return useQuery({
		...DEFAULT_QUERY_OPTIONS,
		...options
	})
}

/**
 * Wrapper around useMutation that applies default options.
 * Use this instead of raw useMutation for consistent error handling.
 */
export function useSafeMutation<
	TData = unknown,
	TError = Error,
	TVariables = void,
	TContext = unknown
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
	return useMutation({
		...DEFAULT_MUTATION_OPTIONS,
		...options
	})
}
