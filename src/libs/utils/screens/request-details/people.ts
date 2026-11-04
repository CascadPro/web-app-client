export const getFullName = (
	user?: { name?: string | null; surname?: string | null } | null
): string => [user?.name, user?.surname].filter(Boolean).join(" ")
