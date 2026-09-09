import type { ApiErrorCode } from "./api"

export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
	invalid_argument: "Некорректные данные",
	validation_error: "Проверьте правильность введённых данных",

	unauthorized: "Требуется авторизация",
	forbidden: "Недостаточно прав",
	not_found: "Ресурс не найден",
	conflict: "Конфликт данных",
	too_many_requests: "Слишком много запросов",

	invalid_credentials: "Неверная почта или пароль",

	user_not_found: "Пользователь не найден",
	user_not_activated: "Аккаунт не активирован",
	email_already_exists: "Пользователь с такой почтой уже существует",
	username_already_exists: "Это имя пользователя уже занято",

	client_not_found: "Клиент не найден",
	client_already_exists: "Клиент уже существует",

	file_not_found: "Файл не найден",
	file_already_exists: "Файл уже существует",
	file_access_denied: "Нет доступа к файлу",
	unsupported_file: "Неподдерживаемый тип файла",
	file_too_large: "Файл слишком большой",

	request_not_found: "Запрос не найден",
	request_already_exists: "Такой запрос уже существует",
	request_access_denied: "Нет доступа к запросу",
	request_already_handled: "Запрос уже обработан",

	session_not_found: "Сессия не найдена",
	session_expired: "Сессия истекла",
	session_revoked: "Сессия отозвана",

	settings_not_found: "Настройки не найдены",

	invalid_token: "Недействительный токен",
	token_expired: "Срок действия токена истёк",

	internal_error: "Внутренняя ошибка сервера"
}
