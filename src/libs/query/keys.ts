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
	}
}
