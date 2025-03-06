import { API_URL } from "./config"

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  first_name: string
  last_name: string
  department: string
  team: string
  position: string
  category: string
  email: string
  password: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  // Добавьте другие поля, которые может возвращать ваш бэкенд
}

interface UpdatePasswordRequest {
  access_token: string
  refresh_token: string
  new_password: string
}

interface UserProfile {
  first_name: string
  last_name: string
  department: string
  team: string
  position: string
  email: string
}

export const api = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    return response.json()
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Registration failed")
    }

    return response.json()
  },

  verifyEmail: async (token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      throw new Error("Email verification failed")
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to send reset password email")
    }
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      throw new Error("Failed to reset password")
    }
  },

  updatePassword: async (data: UpdatePasswordRequest): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to update password")
    }

    await response.json()
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      throw new Error("No access token found")
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized")
      } else if (response.status === 404) {
        throw new Error("User not found")
      } else {
        throw new Error("Failed to fetch user profile")
      }
    }

    return response.json()
  },
}

