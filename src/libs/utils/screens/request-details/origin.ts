const getLink = (type: string | undefined, value: string) => {
	switch (type) {
		case "email":
			return { href: `mailto:${value}`, label: "Написать письмо" }

		case "phone":
			return { href: `tel:${value.replace(/[^\d+]/g, "")}`, label: "Позвонить" }

		case "url":
			return { href: value, label: "Перейти по ссылке" }
	}

	return null
}

export interface OriginItem {
	type?: string
	value?: string
	email?: string
	phone?: string
	other?: string
}

export const processOriginItem = (item: OriginItem) => {
	let type = item.type
	let value = item.value ?? ""

	// Use structured fields if available
	if (item.email) {
		value = item.email
	} else if (item.phone) {
		value = item.phone
	} else if (item.other) {
		value = item.other
	}

	if (URL.canParse(value)) {
		type = "url"
	}

	const link = getLink(type, value)

	return { type, link, value }
}