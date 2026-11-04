export interface RequestsUiStore {
	/** Заявка, которую нужно ненадолго подсветить в списке (только что создана) */
	highlightId: string | null

	highlight: (id: string) => void
	clearHighlight: () => void
}
