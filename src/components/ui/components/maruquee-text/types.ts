export type MarqueeTextTagName =
	"div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span"

export interface MarqueeTextProps {
	children: string
	className?: string
	shadow?: boolean
	tag?: MarqueeTextTagName
	options?: MarqueeTextOptions
}

export interface MarqueeTextOptions {
	speed?: number
	backDuration?: number
	startDelay?: number
	resetDelay?: number
	infinite?: boolean
}
