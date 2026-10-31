/**
 * ЕДИНЫЙ конфиг дизайна: анимации, стекло (Liquid Glass), пороги производительности.
 * Цвета лежат рядом, в ./palette.ts.
 *
 * Всё остальное (CSS-переменные, пружины motion, варианты, boot-скрипт)
 * строится из этого файла — менять значения нужно только здесь.
 */

type Bezier = [number, number, number, number]

export const DESIGN = {
	motion: {
		/** секунды (для motion/react). В CSS те же значения идут как --motion-* в мс */
		duration: {
			instant: 0.1,
			fast: 0.15,
			base: 0.22,
			slow: 0.35
		},
		ease: {
			out: [0.22, 1, 0.36, 1] as Bezier,
			inOut: [0.65, 0, 0.35, 1] as Bezier,
			emphasized: [0.2, 0, 0, 1] as Bezier
		},
		/** Пружины. Все spring-анимации проекта берут значения отсюда */
		spring: {
			soft: { type: "spring", stiffness: 380, damping: 30, mass: 0.8 },
			snappy: { type: "spring", stiffness: 500, damping: 35 },
			sheet: { type: "spring", stiffness: 320, damping: 32, mass: 0.8 },
			modal: { type: "spring", stiffness: 420, damping: 32, mass: 0.7 },
			/** «жидкое» перетекание индикаторов (табы, переключатели) */
			liquid: { type: "spring", stiffness: 500, damping: 32, mass: 1.3 },
			toggle: { type: "spring", stiffness: 750, damping: 24, mass: 1 },
			segmented: { type: "spring", stiffness: 600, damping: 36 },
			segmentedTrail: { type: "spring", stiffness: 160, damping: 24 },
			/** резиновое растяжение шторки при вытягивании */
			rubber: { type: "spring", stiffness: 400, damping: 28 }
		},
		stagger: {
			step: 0.05,
			/** сколько элементов списка анимируем по очереди — остальные сразу */
			max: 8
		},
		/** Во сколько раз укорачиваем анимации на слабых устройствах */
		liteScale: 0.7
	},

	/**
	 * Liquid Glass — ТОЛЬКО iOS (`html[data-platform="ios"]`).
	 * На остальных платформах и на слабых устройствах — плоский fallback без backdrop-filter.
	 */
	glass: {
		light: {
			bg: "rgb(255 255 255 / 34%)",
			bgThick: "rgb(255 255 255 / 58%)",
			sheen: "rgb(255 255 255 / 55%)",
			border: "rgb(255 255 255 / 70%)",
			edge: "rgb(255 255 255 / 95%)",
			rim: "rgb(0 0 0 / 7%)",
			shadow: "rgb(20 24 40 / 16%)",
			blur: "16px",
			saturate: "180%",
			brightness: "1.04"
		},
		dark: {
			bg: "rgb(60 60 67 / 36%)",
			bgThick: "rgb(36 36 40 / 62%)",
			sheen: "rgb(255 255 255 / 14%)",
			border: "rgb(255 255 255 / 16%)",
			edge: "rgb(255 255 255 / 30%)",
			rim: "rgb(0 0 0 / 35%)",
			shadow: "rgb(0 0 0 / 40%)",
			blur: "18px",
			saturate: "170%",
			brightness: "1"
		}
	},

	/**
	 * Слабое устройство (`html[data-perf="low"]`): стекло, бесконечные анимации
	 * и stagger отключаются, остальные анимации укорачиваются.
	 * Определяется в boot-скрипте до первой отрисовки.
	 */
	perf: {
		lowCores: 4,
		lowMemoryGb: 4
	}
} as const

export type SpringName = keyof typeof DESIGN.motion.spring
