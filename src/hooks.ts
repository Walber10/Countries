import { CountryData } from './model'
import { useMemo } from 'react'
import {orderBy} from 'lodash'


export function useFetch(url: string, signal: AbortSignal | undefined) {
  return fetch(url, {
    signal,
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok')
    }
    return res.json()
  })
}

export function useDisplayedCountries(
  countriesData: CountryData[],
  searchCountryName?: string,
  filteredCountries?: CountryData[],
): CountryData[] | undefined {
  const displayedCountries = useMemo(() => {
    return searchCountryName && searchCountryName !== ''
      ? filteredCountries
      : countriesData
  }, [searchCountryName, filteredCountries, countriesData])

  return displayedCountries
}

export function usePaginatedCountries(
  currentPage: number,
  countriesPerPage: number,
  displayedCountries: CountryData[],
): CountryData[] {
  return useMemo(() => {
    const sortedCountriesData = orderBy(
        displayedCountries,
        ['name.official'], 
        ['asc'] 
      );
    return sortedCountriesData.slice(
      (currentPage - 1) * countriesPerPage,
      currentPage * countriesPerPage,
    )
  }, [displayedCountries, currentPage, countriesPerPage])
}
