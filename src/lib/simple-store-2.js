const storeData = {
	store: undefined,
}

/**
 * Simple utility for holding data in memory. Data is stored in file context.
 *
 * @version 2.0
 *
 * @param {string} storeId
 */
export default function SimpleStore( storeId = undefined ) {
	if ( ! storeId ) {
		storeId = `s${ Date.now() }`
	}

	storeData.store = storeData.store || {}
	storeData.store[ storeId ] = storeData.store[ storeId ] || {}

	return {
		set( key, value, merge = true ) {
			if ( ! key || typeof key !== 'string' ) {
				return
			}

			const oldProps = storeData.store[ storeId ][ key ]
			if ( merge &&
					typeof value === 'object' && value !== null &&
					typeof oldProps === 'object' && oldProps !== null
			) {
				storeData.store[ storeId ][ key ] = { ...oldProps, ...value }
			}
			else {
				storeData.store[ storeId ][ key ] = value
			}
		},

		get( key = undefined, defaultValue = undefined ) {
			if ( key && typeof key === 'string' ) {
				return storeData.store[ storeId ][ key ]
			}
			return storeData.store[ storeId ] ?? defaultValue
		},

		getAll() {
			return storeData.store
		},

		isEmpty() {
			return ! Object.keys( storeData.store[ storeId ] )
		},

		reset() {
			storeData.store[ storeId ] = {}
		},

		resetAll() {
			storeData.store = undefined
		},
	}
}
