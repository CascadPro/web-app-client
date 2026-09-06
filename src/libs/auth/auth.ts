import { service } from "@/api/instance"
import { CookieStorageKeys } from "@/libs/constants"
import { CookieStorage } from "@/libs/utils"
import { useAuthStore } from "@/store/auth"

export interface LoginInput {
	email: string
	password: string
}

export interface RegisterInput {
	email: string
	password: string
	token: string
}

const accessStorage = new CookieStorage(CookieStorageKeys.ACCESS_TOKEN)

const refreshStorage = new CookieStorage(CookieStorageKeys.REFRESH_TOKEN)

export const login = async ({ email, password }: LoginInput) => {
	const response = await service.postAuthLogin({
		email,
		password
	})

	const { access_token, refresh_token } = response.data

	if (access_token) {
		accessStorage.save(access_token, {
			expiresMs: "15min"
		})
	}

	if (refresh_token) {
		refreshStorage.save(refresh_token, {
			expiresMs: "30d"
		})
	}

	return response
}

export const register = async ({ email, password, token }: RegisterInput) => {
	await service.postAuthRegister({
		email,
		password,
		token
	})

	return login({
		email,
		password
	})
}

export const logout = async () => {
	try {
		await service.postAuthLogout()
	} finally {
		accessStorage.remove()
		refreshStorage.remove()

		useAuthStore.getState().setUnauthenticated()
	}
}
