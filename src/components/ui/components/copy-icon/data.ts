interface SparkData {
	id: string
	x: number
	y: number
	delay: number
}

export const COPY_ICON_SPARKS: SparkData[] = [
	{ id: "1", x: 0, y: -13, delay: 0 },
	{ id: "2", x: 9, y: -9, delay: 0.015 },
	{ id: "3", x: 13, y: 0, delay: 0.03 },
	{ id: "4", x: 9, y: 9, delay: 0.045 },
	{ id: "5", x: 0, y: 13, delay: 0.06 },
	{ id: "6", x: -9, y: 9, delay: 0.075 },
	{ id: "7", x: -13, y: 0, delay: 0.09 },
	{ id: "8", x: -9, y: -9, delay: 0.105 }
] as const

export const COPY_ICON_SPARK_TRANSITION = {
	duration: 0.42,
	ease: "easeOut" as const
}

export const COPY_ICON_TRANSITION = {
	duration: 0.16,
	ease: "easeOut" as const
}
