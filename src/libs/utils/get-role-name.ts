import { DomainUserRole } from "@/api/generated"

const names = {
	[DomainUserRole.RoleAdmin]: "Админ",
	[DomainUserRole.RoleClerk]: "Работник 2",
	[DomainUserRole.RoleDirector]: "Директор",
	[DomainUserRole.RoleEngineer]: "Инженер",
	[DomainUserRole.RoleForeman]: "Работник",
	[DomainUserRole.RoleProjectManager]: "Руководитель проекта",
	[DomainUserRole.RoleRegular]: "Пользователь"
} as const

export const roleName = (role: DomainUserRole): string =>
	names[role as keyof typeof names]
