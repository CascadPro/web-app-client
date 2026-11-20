/**
 * Phone number utilities for international phone numbers.
 * Uses libphonenumber-js for parsing and formatting.
 */

import { parsePhoneNumberFromString, type PhoneNumber, type CountryCode } from 'libphonenumber-js'

/** Default country code for formatting when not specified */
export const DEFAULT_COUNTRY_CODE: CountryCode = 'RU'

/** Mask options for Russian phone input (backward compatibility) */
export const RU_PHONE_MASK = "+{7} (000) 000-00-00"
export const RU_PHONE_PLACEHOLDER = "+7 (900) 000-00-00"

/** Get only digits from a string */
export const getPhoneDigits = (value: string): string =>
	value.replace(/\D/g, "")

/**
 * Strips Russian phone prefixes (8, 7, +7) from the beginning of input
 * when the field is empty.
 */
export const stripRuPhonePrefix = (
	appended: string,
	isFieldEmpty: boolean
): string => (isFieldEmpty ? appended.replace(/^\s*(?:\+?7|8)/, "") : appended)

/** Check if the unmasked value (with country code 7) is empty */
export const isPhoneFieldEmpty = (unmaskedValue: string): boolean =>
	unmaskedValue.replace(/^7/, "") === ""

/**
 * Format a phone number for display.
 * If the number is a valid Russian number, formats as +7 (XXX) XXX-XX-XX.
 * Otherwise, returns the international format.
 */
export const formatPhoneForDisplay = (value: string, defaultCountry: CountryCode = DEFAULT_COUNTRY_CODE): string => {
	const phoneNumber = parsePhoneNumberFromString(value, defaultCountry)
	if (phoneNumber && phoneNumber.isValid()) {
		return phoneNumber.formatInternational()
	}
	// Fallback: try to format as Russian number
	const formatted = formatRuPhone(value)
	return formatted ?? value
}

/**
 * Format a Russian phone number as +7 (XXX) XXX-XX-XX.
 * Returns null if not a valid Russian number (10-11 digits).
 */
export const formatRuPhone = (value: string): string | null => {
	const digits = getPhoneDigits(value)

	let national: string

	if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
		national = digits.slice(1)
	} else if (digits.length === 10) {
		national = digits
	} else {
		return null
	}

	return `+7 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 8)}-${national.slice(8, 10)}`
}

/**
 * Parse and validate a phone number, returning structured components.
 * Returns null if invalid.
 */
export const parsePhoneNumber = (value: string, defaultCountry: CountryCode = DEFAULT_COUNTRY_CODE): ParsedPhoneNumber | null => {
	const phoneNumber = parsePhoneNumberFromString(value, defaultCountry)
	if (!phoneNumber || !phoneNumber.isValid()) {
		return null
	}

	const e164 = phoneNumber.format('E.164')
	const countryCode = phoneNumber.countryCallingCode
	const nationalNumber = phoneNumber.nationalNumber

	// Extract operator code (first digits of national number)
	// This is a simplified heuristic; real operator code detection is complex
	const nationalStr = nationalNumber.toString()
	let operatorCode = ''
	let subscriber = nationalStr

	// Common operator code lengths by country
	const operatorPrefixLen: Record<string, number> = {
		'7': 3,   // Russia
		'375': 2, // Belarus
		'1': 3,   // US/Canada (area code)
		'44': 4,  // UK (area code)
	}

	const prefixLen = operatorPrefixLen[countryCode] || (nationalStr.length > 7 ? 3 : 0)
	if (prefixLen > 0 && nationalStr.length > prefixLen) {
		operatorCode = nationalStr.slice(0, prefixLen)
		subscriber = nationalStr.slice(prefixLen)
	}

	return {
		e164,
		countryCode,
		operatorCode,
		subscriber,
		national: nationalStr,
	}
}

/** Structured phone number representation matching backend PhoneNumber type */
export interface ParsedPhoneNumber {
	e164: string
	countryCode: string
	operatorCode: string
	subscriber: string
	national: string
}

/** IMask options for Russian phone input (backward compatibility) */
export const RU_PHONE_MASK_OPTIONS = {
	mask: RU_PHONE_MASK,
	lazy: true,
	prepare: (appended: string, masked: { unmaskedValue: string }): string =>
		stripRuPhonePrefix(appended, isPhoneFieldEmpty(masked.unmaskedValue))
}

/** Normalize origin value for storage/transmission */
export const normalizeOriginValue = (type: string, value: string): string => {
	const trimmed = value.trim()

	if (type === "phone") {
		const parsed = parsePhoneNumber(trimmed)
		return parsed?.e164 ?? trimmed
	}
	return trimmed
}

/** Validate email format */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
	return emailRegex.test(email)
}

/** Normalize email to lowercase */
export const normalizeEmail = (email: string): string => {
	return email.trim().toLowerCase()
}