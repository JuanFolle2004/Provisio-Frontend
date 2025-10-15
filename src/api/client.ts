import { env } from '@/config/env'
import { useAuthStore } from '@/store/authStore'

export interface ApiError {
  status: number
  message: string
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  json?: unknown
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
}

const baseUrl = env.backendBaseUrl.replace(/\/$/, '')

export const apiFetch = async <TResponse>(path: string, options: RequestOptions = {}) => {
  const { method = 'GET', json, params, headers } = options
  const token = useAuthStore.getState().token

  const url = new URL(path, baseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.set(key, String(value))
    })
  }

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': json ? 'application/json' : undefined,
      ...(headers ?? {}),
    },
  }

  if (!json) {
    delete (requestInit.headers as Record<string, string | undefined>)['Content-Type']
  }

  if (json) {
    requestInit.body = JSON.stringify(json)
  }

  if (token) {
    ;(requestInit.headers as Record<string, string>).Authorization = Bearer 
  }

  const response = await fetch(url, requestInit)

  if (!response.ok) {
    const errorBody = await response.text()
    const error: ApiError = {
      status: response.status,
      message: errorBody || response.statusText,
    }
    throw error
  }

  if (response.status === 204) {
    return null as TResponse
  }

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return (await response.json()) as TResponse
  }

  return (await response.text()) as TResponse
}
