"use client"

import type { FC } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type ToastType = "success" | "error" | "info"

interface ToastProps {
	title: string
	description?: string
	type: ToastType
}

const typeStyles = {
	success: "border-l-[#00ff00]",
	error: "border-error-container!",
	info: "border-l-primary"
} satisfies Record<ToastType, string>

const ToastContent: FC<ToastProps> = ({ title, description, type }) => {
	return (
		<div
			className={`border-surface-variant bg-surface text-on-surface pointer-events-auto w-full rounded-lg border border-l-4 px-4 py-3 shadow-xl ${typeStyles[type]} `}
		>
			<p className="text-sm leading-5 font-semibold">{title}</p>

			{description && (
				<p className="text-on-surface-variant mt-0.5 text-sm leading-5">
					{description}
				</p>
			)}
		</div>
	)
}

export const Toast = {
	show({
		type = "info",
		text1,
		text2
	}: {
		type?: ToastType
		text1: string
		text2?: string
	}) {
		return toast(
			<ToastContent type={type} title={text1} description={text2} />,
			{
				autoClose: 4000,
				closeButton: false,
				hideProgressBar: true
			}
		)
	},

	hide(id?: string | number) {
		toast.dismiss(id)
	}
}

export const ToastProvider = () => {
	return (
		<ToastContainer
			position="top-center"
			closeButton={false}
			hideProgressBar
			newestOnTop
			draggable
			draggableDirection="y"
			limit={3}
			toastClassName="w-full! bg-transparent! p-0! shadow-none!"
			className="top-[calc(env(safe-area-inset-top)+1rem)]! px-4! sm:top-6! sm:min-w-96! sm:px-6!"
		/>
	)
}
