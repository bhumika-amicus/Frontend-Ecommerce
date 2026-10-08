export interface StateOption {
  name: string
  state_code: string
}

export interface ApiResponse<T> {
  data: T
  error?: boolean
  msg?: string
}

const apiBaseUrl = 'https://countriesnow.space/api/v0.1/countries'

export async function getCountries(signal?: AbortSignal): Promise<string[]> {
  const response = await fetch(apiBaseUrl, { signal })
  if (!response.ok) throw new Error('Could not load countries')

  const result = await response.json() as ApiResponse<{ country: string }[]>
  if (result.error || !Array.isArray(result.data)) {
      throw new Error(result.msg || 'Could not load countries')
  }

  return result.data.map(({ country }) => country)
}

export async function getStates(country: string, signal?: AbortSignal): Promise<StateOption[]> {
  const response = await fetch(`${apiBaseUrl}/states`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ country }),
      signal,
  })

  if (!response.ok) {
      throw new Error('Location data request failed')
  }

  const result = await response.json() as ApiResponse<{ states?: StateOption[] }>
  if (result.error) {
      throw new Error(result.msg || 'Location data request failed')
  }

  return result.data.states || []
}

export async function getCities(country: string, state: string, signal?: AbortSignal): Promise<string[]> {
  const response = await fetch(`${apiBaseUrl}/state/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ country, state }),
      signal,
  })

  if (!response.ok) {
      throw new Error('Location data request failed')
  }

  const result = await response.json() as ApiResponse<string[]>
  if (result.error) {
      throw new Error(result.msg || 'Location data request failed')
  }

  return result.data || []
}
