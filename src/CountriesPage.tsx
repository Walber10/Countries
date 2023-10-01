import React, { useState } from 'react'
import Pagination from '@mui/material/Pagination'
import {
  Typography,
  Paper,
  Stack,
  TextField,
  Container,
  CircularProgress,
  Box,
} from '@mui/material'
import { CountryData } from './model'
import { useQuery } from '@tanstack/react-query'
import { BASE_URL } from './Constants'
import { useDisplayedCountries, useFetch, usePaginatedCountries } from './hooks'
import { useDebounce } from '@uidotdev/usehooks'

function getCurrencyDetails(country: CountryData) {
  for (const currencyKey in country.currencies) {
    if (country.currencies.hasOwnProperty(currencyKey)) {
      const currency = country.currencies[currencyKey]
      return `${currency.name} - ${currency.symbol}`
    }
  }
}

interface CountryCardProps {
  country: CountryData
}
const CountryCard = ({ country }: CountryCardProps) => {
  const { name, capital, flags, coatOfArms, car } = country
  const currencyDetails = getCurrencyDetails(country)
  return (
    <Paper
      sx={{ width: '100%', maxWidth: '250px', height: '200px' }}
      elevation={3}
    >
      <Stack gap={1} padding={1} height="200px">
        <Typography variant="body2" noWrap>
          Name: <strong>{name.official}</strong>
        </Typography>
        <Typography variant="caption" color="InfoText">
          Capital: <strong>{capital}</strong>
        </Typography>
        {currencyDetails && (
          <Typography color="primary" variant="caption">
            Currency: <strong>{currencyDetails}</strong>
          </Typography>
        )}
        <Typography variant="caption" color="InfoText" component="span">
          Flag:{' '}
          <Box
            src={flags.png}
            alt="Flag"
            width="20px"
            height="20px"
            component="img"
          />
        </Typography>
        {coatOfArms?.png && (
          <Typography variant="caption" color="InfoText" component="span">
            Coat of Arms:{' '}
            <Box
              src={coatOfArms.png}
              alt="Coat of Arms"
              width="20px"
              height="20px"
              component="img"
            />
          </Typography>
        )}
        <Typography variant="caption" color="InfoText">
          Drive Side: {car.side}
        </Typography>
      </Stack>
    </Paper>
  )
}

interface SearchCountryInputProps {
  onSearchTermChange: (value: string) => void
}
const SearchCountryInput = ({
  onSearchTermChange,
}: SearchCountryInputProps) => {
  return (
    <TextField
      label="Search a country"
      onChange={(event) => onSearchTermChange(event.target.value)}
    />
  )
}

interface DisplayCountryListProps {
  countries: CountryData[]
  isFilteredCountryLoading: boolean
}
const DisplayCountryList = ({
  countries,
  isFilteredCountryLoading,
}: DisplayCountryListProps) => {
  if (countries.length === 0 && isFilteredCountryLoading)
    return <CircularProgress />
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      {countries.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No countries found
        </Typography>
      ) : (
        countries.map((country, index) => {
          return <CountryCard country={country} key={index} />
        })
      )}
    </Stack>
  )
}

const COUNTRIES_PER_PAGE = 5
export const CountriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const handleChangePage = (_: any, newPage: number) => {
    setCurrentPage(newPage)
  }
  const [searchCountryName, setSearchCountryName] = useState<string>()
  const [debouncedCountryName] = useDebounce([searchCountryName], 1000)

  const { data: countriesData, isLoading, isError } = useQuery<CountryData[]>({
    queryKey: ['countriesData'],
    //pass signal to abort controller
    queryFn: ({ signal }) => useFetch(`${BASE_URL}/all`, signal),
  })

  const {
    data: filteredCountries,
    isLoading: isFilteredCountryLoading,
  } = useQuery<CountryData[]>({
    queryKey: ['filteredCountries', debouncedCountryName],
    queryFn: ({ signal }) =>
      useFetch(`${BASE_URL}/name/${debouncedCountryName}`, signal),
    enabled: searchCountryName != undefined && searchCountryName != '',
  })
  const handleSearchTermChange = (value: string) => {
    setSearchCountryName(value)
  }
  const displayedCountries = useDisplayedCountries(
    countriesData ?? [],
    searchCountryName,
    filteredCountries,
  )
  const paginatedCountries = usePaginatedCountries(
    currentPage,
    COUNTRIES_PER_PAGE,
    displayedCountries ?? [],
  )
  if (isError) {
    return <Typography>Error: Data could not be loaded.</Typography>
  }
  return (
    <Container>
      <Stack gap={2} marginTop={10}>
        <Typography variant="h5" color="textPrimary">
          Countries Information
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Start typing a country name in the search box below. Results will
          appear in real-time as you type
        </Typography>
        <Stack direction="row" justifyContent="center">
          <SearchCountryInput onSearchTermChange={handleSearchTermChange} />
        </Stack>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <DisplayCountryList
            countries={paginatedCountries}
            isFilteredCountryLoading={isFilteredCountryLoading}
          />
        )}
        <Stack direction="row" justifyContent="center">
          <Pagination
            page={currentPage}
            onChange={handleChangePage}
            count={
              displayedCountries
                ? Math.ceil(displayedCountries?.length / COUNTRIES_PER_PAGE)
                : 0
            }
          />
        </Stack>
      </Stack>
    </Container>
  )
}
