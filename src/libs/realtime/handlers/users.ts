import type { QueryClient } from "@tanstack/react-query"

import type { UsersTransportHttpGetCurrentUserResponse as User } from "@/api/generated"
import { QueryKeys } from "@/libs/query/keys"
import type { UserUpdatedEventData } from "@/libs/realtime/types"

export function handleUsersUpdate(
	client: QueryClient,
	event: { data: UserUpdatedEventData }
): void {
	const queryKey = QueryKeys.users.me()
	const { avatar, ...changes } = event.data

	client.setQueryData<User>(queryKey, previous => {
		if (!previous) {
			return previous
		}

		return { ...previous, ...changes, avatar_file_id: avatar ?? undefined }
	})
}
