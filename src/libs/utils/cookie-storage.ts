import Cookie from "js-cookie"

import { DOMAIN } from "@/libs/constants"
import { ms, StringValue } from "@/libs/utils"

export interface ICookieStorageOptions {
	path?: string
	expiresMs?: StringValue
}

export class CookieStorage {
	readonly STORAGE_KEY: string

	constructor(key: string) {
		this.STORAGE_KEY = key
	}

	save(value: string, { path, expiresMs }: ICookieStorageOptions) {
		Cookie.set(this.STORAGE_KEY, value, {
			domain: DOMAIN,
			sameSite: "strict",
			secure: false,
			...(path ? { path } : {}),
			...(expiresMs ? { expires: new Date(Date.now() + ms(expiresMs)) } : {})
		})
	}

	get(): [boolean, string] {
		const value = Cookie.get(this.STORAGE_KEY)
		if (!value) {
			return [false, ""]
		}

		return [true, value]
	}

	remove() {
		Cookie.remove(this.STORAGE_KEY, {
			expires: -1
		})
	}
}
