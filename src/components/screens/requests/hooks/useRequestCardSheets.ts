"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

import { createLazyLoader, useLazySheet } from "@/libs/hooks/use-lazy-sheet"
import { prefetchRequestDetail } from "@/libs/query/hooks/use-requests"

import { useLater } from "./useLater"

const loadDetails = createLazyLoader(() =>
	import("../components/details/request-details-sheet").then(
		mod => mod.RequestDetailsSheet
	)
)

const loadEdit = createLazyLoader(() =>
	import("../components/edit/request-edit-sheet").then(
		mod => mod.RequestEditSheet
	)
)

/** Пауза, пока «Подробнее» уезжает вниз, прежде чем выехать форме редактирования */
const SWITCH_DELAY = 280

/**
 * Шторки карточки («Подробнее» и «Изменить») грузятся лениво — только когда
 * карточку выделили, — и всегда монтируются закрытыми, чтобы выезд был плавным.
 */
export const useRequestCardSheets = (id: string) => {
	const client = useQueryClient()
	const details = useLazySheet(loadDetails)
	const edit = useLazySheet(loadEdit)
	const later = useLater()

	const { preload: preloadDetails, close: closeDetails } = details
	const { preload: preloadEdit, open: openEdit } = edit

	// Чанки шторок и данные заявки (если они устарели) — к моменту нажатия всё готово
	const preload = useCallback(() => {
		preloadDetails()
		preloadEdit()
		void prefetchRequestDetail(client, id)
	}, [preloadDetails, preloadEdit, client, id])

	const openDetails = details.open

	const editFromDetails = useCallback(() => {
		closeDetails()
		later(() => void openEdit(), SWITCH_DELAY)
	}, [closeDetails, later, openEdit])

	return {
		DetailsSheet: details.Sheet,
		EditSheet: edit.Sheet,
		isDetailsOpen: details.isOpen,
		isEditOpen: edit.isOpen,
		setDetailsOpen: details.setIsOpen,
		setEditOpen: edit.setIsOpen,
		openDetails,
		openEdit,
		editFromDetails,
		preload
	}
}
