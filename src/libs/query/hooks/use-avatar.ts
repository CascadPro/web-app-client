import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosRequestConfig } from "axios"

import type { PatchUsersAvatarBody } from "@/api/generated"
import { service } from "@/api/instance"
import { uploadAvatar, type StreamingUploadOptions } from "@/libs/upload"

import { QueryKeys } from "../keys"

export interface IdempotentMutation {
	idempotencyKey: string
}

export interface UploadAvatarVariables extends IdempotentMutation {
	file: File
	onProgress?: StreamingUploadOptions["onProgress"]
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
		mutationFn: async ({ file, idempotencyKey, onProgress }: UploadAvatarVariables) => {
			const result = await uploadAvatar({
				file,
				headers: { "Idempotency-Key": idempotencyKey },
				onProgress,
			})
			if (!result.success) {
				throw result.error ?? new Error(`Upload failed: ${result.status} ${result.statusText}`)
			}
		},
		onSuccess: () => client.invalidateQueries({ queryKey: QueryKeys.users.all })
	})
}
