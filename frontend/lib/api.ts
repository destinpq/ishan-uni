const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }))
      throw new Error(error.message || 'API request failed')
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: any }>('/auth/login', {
      email,
      password,
    }),
  signup: (email: string, password: string, name: string) =>
    apiClient.post<{ token: string; user: any }>('/auth/signup', {
      email,
      password,
      name,
    }),
  logout: () => {
    apiClient.clearToken()
  },
}

// Universities endpoints
export const universitiesApi = {
  getAll: (page?: number, search?: string) =>
    apiClient.get<any>(
      `/universities?${new URLSearchParams({
        ...(page && { page: page.toString() }),
        ...(search && { search }),
      }).toString()}`
    ),
  getById: (id: string) => apiClient.get<any>(`/universities/${id}`),
}

// Applications endpoints
export const applicationsApi = {
  getAll: () => apiClient.get<any>('/applications'),
  getById: (id: string) => apiClient.get<any>(`/applications/${id}`),
  create: (data: any) => apiClient.post<any>('/applications', data),
  update: (id: string, data: any) =>
    apiClient.put<any>(`/applications/${id}`, data),
  delete: (id: string) => apiClient.delete<any>(`/applications/${id}`),
}
