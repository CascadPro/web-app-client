import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosRequestConfig } from "axios"

import type { PatchUsersAvatarBody } from "@/api/generated"
import { service } from "@/api/instance"

import { QueryKeys } from "../keys"

export interface IdempotentMutation {
	idempotencyKey: string
}

export interface UploadAvatarVariables extends IdempotentMutation {
	body?: PatchUsersAvatarBody
}

const idempotencyConfig = (key: string): AxiosRequestConfig => ({
	headers: { "Idempotency-Key": key }
})

export const useDeleteAvatar = () => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.avatar.delete(),
		mutationFn: async ({ idempotencyKey }: IdempotentMutation) =>
			await service.deleteUsersAvatar(idempotencyConfig(idempotencyKey)),
		onSuccess: () => client.invalidateQueries({ queryKey: QueryKeys.users.all })
	})
}

export const useUploadAvatar = () => {
	const client = useQueryClient()

	return useMutation({
		mutationKey: QueryKeys.avatar.upload(),
		mutationFn: async ({ body, idempotencyKey }: UploadAvatarVariables) =>
			await service.patchUsersAvatar(body, {
				headers: {
					"Idempotency-Key": idempotencyKey,
					"Content-Type": "multipart/form-data"
				}
			}),
		onSuccess: () => client.invalidateQueries({ queryKey: QueryKeys.users.all })
	})
}
