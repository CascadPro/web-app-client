import { RequestsTransportHttpGetRequestsRequest as GetRequestsParams } from "@/api/generated"

export const QueryKeys = {
	users: {
		all: ["users"] as const,

		me: () => [...QueryKeys.users.all, "me"] as const,

		byId: (id: string) => [...QueryKeys.users.all, id] as const
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
			[...QueryKeys.requests.lists(), params] as const,

		stats: () => [...QueryKeys.requests.all, "stats"] as const,

		details: () => [...QueryKeys.requests.all, "detail"] as const,

		detail: (id: string) => [...QueryKeys.requests.details(), id] as const
	}
}
