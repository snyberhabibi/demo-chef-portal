'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { initializeGoogleMaps } from '@/lib/google-maps-loader'
import type { AddressSearchResult } from '@/types/addresses.types'

export interface GooglePlacesSuggestion {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

interface UseGooglePlacesAutocompleteOptions {
  minChars?: number
  countryRestrictions?: string[]
  debounceMs?: number
}

interface UseGooglePlacesAutocompleteResult {
  suggestions: GooglePlacesSuggestion[]
  isLoading: boolean
  error: string | null
  isReady: boolean
  getPlaceDetails: (placeId: string) => Promise<AddressSearchResult | null>
}

const DEFAULT_DEBOUNCE_MS = 300

// Parse region restrictions from environment variable
// Format: comma-separated CLDR country codes (e.g., "US" or "US,CA")
function getRegionRestrictionsFromEnv(): string[] {
  const envValue = process.env.NEXT_PUBLIC_GOOGLE_PLACES_REGION_RESTRICTIONS

  if (!envValue) {
    return ['US'] // Fallback to US if env variable is not set
  }

  // Parse comma-separated values and trim whitespace
  const regions = envValue
    .split(',')
    .map((region) => region.trim())
    .filter((region) => region.length > 0)

  // Return parsed regions or fallback to US if empty
  return regions.length > 0 ? regions : ['US']
}

export function useGooglePlacesAutocomplete(
  query: string,
  options: UseGooglePlacesAutocompleteOptions = {}
): UseGooglePlacesAutocompleteResult {
  // Get region restrictions from env or use provided option, with env taking precedence
  const envRegionRestrictions = getRegionRestrictionsFromEnv()
  
  const { 
    minChars = 3, 
    countryRestrictions = envRegionRestrictions,
    debounceMs = DEFAULT_DEBOUNCE_MS 
  } = options

  const [suggestions, setSuggestions] = useState<GooglePlacesSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentQueryRef = useRef<string>('')
  // Store country restrictions in ref to avoid dependency issues
  const countryRestrictionsRef = useRef(countryRestrictions)
  countryRestrictionsRef.current = countryRestrictions

  // Initialize Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError('Google Maps API key is not configured')
      return
    }

    initializeGoogleMaps(apiKey)
      .then(() => {
        // Create session token for billing optimization
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()
        
        setIsReady(true)
      })
      .catch((err: Error) => {
        setError('Failed to load Google Maps API')
        console.error('Error loading Google Maps API:', err)
      })
  }, [])

  // Fetch predictions when query changes - using new Places API with debouncing
  useEffect(() => {
    if (!isReady) {
      return
    }

    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }

    // Clear suggestions if query is too short
    if (query.length < minChars) {
      setSuggestions([])
      setIsLoading(false)
      setError(null)
      return
    }

    // Set loading state immediately for better UX
    setIsLoading(true)
    setError(null)

    // Store the query at the start of the effect to track changes
    const queryAtEffectStart = query
    currentQueryRef.current = queryAtEffectStart

    // Debounce the API call
    debounceTimeoutRef.current = setTimeout(() => {
      // Use the new Places API (New) - AutocompleteSuggestion.fetch()
      const fetchSuggestions = async () => {
        try {
          // Build the request for the new API
          const request: google.maps.places.AutocompleteRequest = {
            input: queryAtEffectStart,
            includedRegionCodes: countryRestrictionsRef.current,
            sessionToken: sessionTokenRef.current ?? undefined,
            includedPrimaryTypes: ['street_address', 'subpremise', 'premise'],
          }

          const { suggestions: autocompleteSuggestions } =
            await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

          // Only update state if this query is still the current one (avoid stale results)
          if (currentQueryRef.current === queryAtEffectStart) {
            const formattedSuggestions: GooglePlacesSuggestion[] = autocompleteSuggestions
              .filter((s) => s.placePrediction)
              .map((suggestion) => {
                const prediction = suggestion.placePrediction
                return {
                  placeId: prediction?.placeId ?? '',
                  description: prediction?.text.text ?? '',
                  mainText: prediction?.mainText?.text ?? prediction?.text.text ?? '',
                  secondaryText: prediction?.secondaryText?.text ?? '',
                }
              })
              .filter((s) => s.placeId) // Filter out any with empty placeId

            setSuggestions(formattedSuggestions)
            setError(null)
          }
        } catch (err) {
          // Only update error state if this query is still the current one
          if (currentQueryRef.current === queryAtEffectStart) {
            console.error('Google Places API error:', err)
            setSuggestions([])
            setError('Failed to search addresses. Please try again.')
          }
        } finally {
          // Only update loading state if this query is still the current one
          if (currentQueryRef.current === queryAtEffectStart) {
            setIsLoading(false)
          }
        }
      }

      fetchSuggestions()
    }, debounceMs)

    // Cleanup function to clear timeout on unmount or query change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = null
      }
    }
  }, [query, isReady, minChars, debounceMs])

  // Get place details using new Places API
  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<AddressSearchResult | null> => {
      if (!isReady) {
        return null
      }

      try {
        // Use the new Place class
        const place = new google.maps.places.Place({
          id: placeId,
        })

        // Fetch the fields we need including location for lat/lng
        await place.fetchFields({
          fields: ['addressComponents', 'formattedAddress', 'location'],
        })

        // Reset session token after place details fetch (for billing optimization)
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()

        const addressComponents = place.addressComponents

        if (!addressComponents || addressComponents.length === 0) {
          return null
        }

        const result: AddressSearchResult = {
          placeId,
          description: place.formattedAddress || '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          latitude: place.location?.lat(),
          longitude: place.location?.lng(),
        }

        let streetNumber = ''
        let route = ''

        addressComponents.forEach((component) => {
          const types = component.types

          if (types.includes('street_number')) {
            streetNumber = component.longText || ''
          }

          if (types.includes('route')) {
            route = component.longText || ''
          }

          if (types.includes('locality')) {
            result.city = component.longText || ''
          }

          // Fallback to sublocality if locality is not present
          if (!result.city && types.includes('sublocality_level_1')) {
            result.city = component.longText || ''
          }

          if (types.includes('administrative_area_level_1')) {
            result.state = component.shortText || ''
          }

          if (types.includes('postal_code')) {
            result.zipCode = component.longText || ''
          }

          if (types.includes('country')) {
            // Use shortText for 2-letter country code (e.g., "US" instead of "United States")
            result.country = component.shortText || ''
          }
        })

        // Combine street number and route
        result.street = `${streetNumber} ${route}`.trim()

        return result
      } catch (err) {
        console.error('Failed to get place details:', err)
        // Reset session token on error too
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken()
        return null
      }
    },
    [isReady]
  )

  return {
    suggestions,
    isLoading,
    error,
    isReady,
    getPlaceDetails,
  }
}
