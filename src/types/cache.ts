export interface CacheSize {
	bytes: number
	formatted: string
}

export interface CacheStats {
	queryClient: CacheSize
	localStorage: CacheSize
	sessionStorage: CacheSize
	cacheStorage: CacheSize
	browserStorage: CacheStatsBrowserStorage
	totalMeasured: CacheSize
}

export interface CacheStatsBrowserStorage {
	usage: CacheSize
	quota: CacheSize
}
