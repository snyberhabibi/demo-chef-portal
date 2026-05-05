import { importLibrary, setOptions } from '@googlemaps/js-api-loader'

let isInitialized = false
let initializationPromise: Promise<void> | null = null

export async function initializeGoogleMaps(apiKey: string): Promise<void> {
  // If already initialized, return immediately
  if (isInitialized) {
    return Promise.resolve()
  }

  // If initialization is in progress, return the existing promise
  if (initializationPromise) {
    return initializationPromise
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      // Set global options for the Google Maps API (only once)
      setOptions({
        key: apiKey,
        v: 'weekly',
      })

      // Load the Places library
      await importLibrary('places')

      isInitialized = true
    } catch (err) {
      // Reset promise on error so we can retry
      initializationPromise = null
      throw err
    }
  })()

  return initializationPromise
}

export function isGoogleMapsLoaded(): boolean {
  return isInitialized
}
