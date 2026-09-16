import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { PatchUsersAvatarBody } from "@/api/generated"
import { service } from "@/api/instance"
import { getContentType } from "@/libs/utils"

import { QueryKeys } from "../keys"

export const useDeleteAvatar = () => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.avatar.delete(),
		mutationFn: async () => service.deleteUsersAvatar(),
		onSuccess: () => client.invalidateQueries({ queryKey: QueryKeys.users.all })
	})
}

export const useUploadAvatar = () => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.avatar.upload(),
		mutationFn: async (body?: PatchUsersAvatarBody) =>
			service.patchUsersAvatar(body, {
				headers: {
					"Content-Type": String(getContentType("form-data"))
				}
			}),
		onSuccess: () => client.invalidateQueries({ queryKey: QueryKeys.users.all })
	})
}
