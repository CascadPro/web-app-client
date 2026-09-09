import type { AxiosRequestConfig } from "axios"

import { instance } from "./instance"

export const customInstance = async <T>(
	config: AxiosRequestConfig
): Promise<T> => {
	const response = await instance.request<T>(config)
	return response.data
}
