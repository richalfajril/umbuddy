// Payload form login admin di sisi client.
export type AdminLoginFormState = {
  email: string
  password: string
}

// Shape error API admin auth yang aman ditampilkan ke UI.
export type AdminAuthApiError = {
  error?: {
    message?: string
  }
}
