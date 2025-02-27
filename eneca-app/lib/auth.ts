export const setAuthToken = (token: string) => {
  document.cookie = `auth-token=${token}; path=/`
}

export const removeAuthToken = () => {
  document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
}

export const simulateEmailVerification = () => {
  // In a real app, this would be handled by clicking a link in the email
  localStorage.setItem("email-verified", "true")
}

export const isEmailVerified = () => {
  return localStorage.getItem("email-verified") === "true"
}

