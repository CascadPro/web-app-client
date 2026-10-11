export type MarqueeTextTagName =
	"div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span"

export interface MarqueeTextProps {
	children: string
	className?: string
	tag?: MarqueeTextTagName
	options?: MarqueeTextOptions
}

export interface MarqueeTextOptions {
	/**
	 * Speed of text scrolling
	 * @values `x` words per second
	 * @defaults 0.2s
	 */
	speed?: number

	/**
	 * The speed of scrolling text backward **in seconds**
	 * @defaults 0.45s
	 */
	backDuration?: number

	/**
	 * The time **in seconds** the text will wait for the start of scrolling
	 * @defaults 3s
	 */
	startDelay?: number

	/**
	 * The text waiting time **in seconds** before reset
	 * @defaults 1s
	 */
	resetDelay?: number

	/**
	 * Should the scrolling repeat after the first one
	 * @defaults true
	 */
	infinite?: boolean
}
