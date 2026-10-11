import { DomainSortType } from "@/api/generated"

export function getSortLabel(type: DomainSortType): string {
	switch (type) {
		case "newest":
			return "Сначала новые"
		case "oldest":
			return "Сначала старые"
		case "popular":
			return "Сначала популярные"
		default:
			return ""
	}
}
