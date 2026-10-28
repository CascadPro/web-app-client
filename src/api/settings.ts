import type {
	SettingsTransportHttpGetUserSettingsResponse,
	SettingsTransportHttpPatchUserSettingsRequest
} from "@/api/generated"
import { service } from "@/api/instance"

type GeneratedPreferences = NonNullable<
	SettingsTransportHttpGetUserSettingsResponse["preferences"]
>
type GeneratedNotifications = NonNullable<
	SettingsTransportHttpGetUserSettingsResponse["notifications"]
>

export type ThemePreference = NonNullable<GeneratedPreferences["theme"]>
export type AccentPreference = NonNullable<GeneratedPreferences["accent"]>
export type AnimationPreference = NonNullable<
	GeneratedPreferences["animations"]
>
export type DensityPreference = NonNullable<GeneratedPreferences["density"]>
export type TextSizePreference = NonNullable<GeneratedPreferences["text_size"]>
export type SessionExpireTerm = NonNullable<
	SettingsTransportHttpGetUserSettingsResponse["session_expire_term"]
>

export type UserSettingsResponse = Omit<
	SettingsTransportHttpGetUserSettingsResponse,
	| "id"
	| "version"
	| "preferences"
	| "notifications"
	| "session_expire_term"
	| "session_2fa_enabled"
> & {
	id: string
	version: number
	session_expire_term: SessionExpireTerm
	session_2fa_enabled: boolean
	preferences: Required<GeneratedPreferences>
	notifications: Required<GeneratedNotifications>
}

export type PatchUserSettingsRequest =
	SettingsTransportHttpPatchUserSettingsRequest

export type SettingsChanges = Omit<PatchUserSettingsRequest, "version">

const normalizeUserSettings = (
	response: SettingsTransportHttpGetUserSettingsResponse
): UserSettingsResponse => ({
	...response,
	id: response.id ?? "",
	version: response.version ?? 0,
	session_expire_term: response.session_expire_term ?? "30d",
	session_2fa_enabled: response.session_2fa_enabled ?? false,
	preferences: {
		theme: response.preferences?.theme ?? "system",
		accent: response.preferences?.accent ?? "mauve",
		animations: response.preferences?.animations ?? "system",
		density: response.preferences?.density ?? "comfortable",
		text_size: response.preferences?.text_size ?? "medium",
		confirm_important_actions:
			response.preferences?.confirm_important_actions ?? true
	},
	notifications: {
		requests: response.notifications?.requests ?? true,
		sessions: response.notifications?.sessions ?? true,
		system: response.notifications?.system ?? true,
		push: response.notifications?.push ?? false
	}
})

export async function getUserSettings(): Promise<UserSettingsResponse> {
	const response = await service.getSettingsUser()
	return normalizeUserSettings(response.data)
}

export async function patchUserSettings(
	request: PatchUserSettingsRequest
): Promise<UserSettingsResponse> {
	const response = await service.patchSettingsUser(request)
	return normalizeUserSettings(response.data)
}
