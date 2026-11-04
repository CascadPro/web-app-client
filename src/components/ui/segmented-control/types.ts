export interface SegmentedOption<T extends string> {
	value: T
	label: string
}

export type SegmentedControlSize = "sm" | "md"

export interface SegmentedControlProps<T extends string> {
	value: T
	options: SegmentedOption<T>[]
	/** Доступное имя группы (читается скринридером) */
	label: string
	onChange: (value: T) => void
	size?: SegmentedControlSize
	className?: string
}
