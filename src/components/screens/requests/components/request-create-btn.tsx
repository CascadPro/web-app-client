"use client"

import { PlusIcon } from "lucide-react"
import { memo } from "react"

import { Button } from "@/components/ui"
import { useIsIOS } from "@/libs/hooks"
import { cn } from "@/libs/utils"

import { useRequestCreateSheet } from "../hooks/useRequestCreateSheet"

/**
 * Кнопка стоит в строке хедера, зеркально кнопке «назад»
 * (те же размеры: p-2.5 + иконка 24px = 44px; на iOS — то же «стекло»).
 */
const RequestCreateButtonComponent = () => {
	const isIOS = useIsIOS()

	const { Sheet, isOpen, isLoading, setIsOpen, open, preload } =
		useRequestCreateSheet()

	return (
		<>
			<Button
				variant="ghost"
				title="Создать заявку"
				aria-label="Создать заявку"
				aria-haspopup="dialog"
				className={cn("fixed right-2 z-50 rounded-full p-2.5", {
					"hover:bg-secondary/40 active:bg-secondary/40 top-[calc(env(safe-area-inset-top)+0.625rem)]":
						!isIOS,
					"glass glass-highlight top-[calc(env(safe-area-inset-top)+0.75rem)] border-none! duration-200 hover:scale-[.98] hover:before:opacity-0 hover:after:opacity-0 active:scale-90 active:before:opacity-0 active:after:opacity-0":
						isIOS
				})}
				isLoading={isLoading}
				onPointerEnter={preload}
				onTouchStart={preload}
				onFocus={preload}
				onClick={open}
			>
				<PlusIcon size={24} />
			</Button>

			{Sheet && <Sheet open={isOpen} onOpenChange={setIsOpen} />}
		</>
	)
}

export const RequestCreateButton = memo(RequestCreateButtonComponent)
