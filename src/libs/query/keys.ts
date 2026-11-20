import { RequestsTransportHttpGetRequestsRequest as GetRequestsParams } from "@/api/generated"

export const QueryKeys = {
	users: {
		all: ["users"] as const,

		me: () => [...QueryKeys.users.all, "me"] as const,

		byId: (id: string) => [...QueryKeys.users.all, id] as const
	},

	settings: {
		all: ["settings"] as const,

		current: () => [...QueryKeys.settings.all, "user"] as const
	},

	sessions: {
		all: ["sessions"] as const,

		delete: (id: string) => [...QueryKeys.sessions.all, "delete", id] as const,

		deleteAll: () => [...QueryKeys.sessions.all, "deleteAll"] as const
	},

	avatar: {
		_default: ["avatar"] as const,

		delete: () => [...QueryKeys.avatar._default, "delete"] as const,

		upload: () => [...QueryKeys.avatar._default, "upload"] as const
	},

	requests: {
		all: ["requests"] as const,

		lists: () => [...QueryKeys.requests.all, "list"] as const,

		list: (params?: GetRequestsParams) =>
			[...QueryKeys.requests.lists(), ...(params ? [params] : [])] as const,

		stats: () => [...QueryKeys.requests.all, "stats"] as const,

		create: () => [...QueryKeys.requests.all, "create"] as const,

		update: (id: string) => [...QueryKeys.requests.all, "update", id] as const,

		fileUpload: (id: string, index: number) =>
			[...QueryKeys.requests.all, "file-upload", id, index] as const,

		fileDelete: (id: string, index: number) =>
			[...QueryKeys.requests.all, "file-delete", id, index] as const,

		details: () => [...QueryKeys.requests.all, "detail"] as const,

		detail: (id: string) => [...QueryKeys.requests.details(), id] as const
	},

	clients: {
		all: ["clients"] as const,

		list: (params?: Record<any, any>) =>
			[...QueryKeys.clients.all, ...(params ? [params] : [])] as const,

		detail: (id: string) => [...QueryKeys.clients.all, "detail", id] as const
	}
}
