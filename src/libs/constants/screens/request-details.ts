import {
	FileArchiveIcon,
	FileIcon,
	FileImageIcon,
	FileSpreadsheetIcon,
	FileTextIcon,
	type LucideIcon,
	MailIcon,
	PhoneIcon,
	UsersIcon
} from "lucide-react"

import type { FileKind } from "@/libs/utils/screens/request-details"

/** Названия незаполненных полей: ключи приходят с бэкенда, неизвестные показываем как есть */
export const REQUEST_FIELD_LABELS: Record<string, string> = {
	title: "Название",
	deadline: "Срок сдачи",
	client: "Заказчик",
	origin: "Источники",
	work_types: "Виды работ",
	geography: "География",
	contract: "Договор",
	project: "Проект",
	specification: "Спецификация",
	tech_task: "Техническое задание"
}

export const REQUEST_ORIGIN_ICON: Record<string, LucideIcon> = {
	email: MailIcon,
	phone: PhoneIcon,
	other: UsersIcon
}

export const REQUEST_ORIGIN_LABEL: Record<string, string> = {
	email: "Email",
	phone: "Телефон",
	other: "Другое"
}

export const FILE_KIND_ICON: Record<FileKind, LucideIcon> = {
	pdf: FileTextIcon,
	doc: FileTextIcon,
	sheet: FileSpreadsheetIcon,
	image: FileImageIcon,
	archive: FileArchiveIcon,
	other: FileIcon
}

export const FILE_KIND_STYLE: Record<FileKind, string> = {
	pdf: "bg-error/10 text-error",
	doc: "bg-primary/10 text-primary",
	sheet: "bg-success/10 text-success",
	image: "bg-warning/10 text-warning",
	archive: "bg-outline/30 text-on-surface-variant",
	other: "bg-outline/30 text-on-surface-variant"
}

export const USER_ROLE_LABEL: Record<string, string> = {
	foreman: "Прораб",
	project_manager: "Руководитель проекта",
	clerk: "Делопроизводитель",
	engineer: "Инженер",
	director: "Директор",
	regular: "Сотрудник"
}

/** Кто и что сделал со статусом */
export const STATUS_BY_LABEL: Record<string, string> = {
	approved: "Одобрил(а)",
	rejected: "Отклонил(а)",
	waiting: "Отправил(а) на рассмотрение",
	default: "Изменил(а) статус"
}
