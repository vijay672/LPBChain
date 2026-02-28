export const AUTH_STORAGE_KEY = "plu_ai_auth_session"
export const DUMMY_LOGIN_ID = "demo"
export const DUMMY_LOGIN_PASSWORD = "demo123"

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "1"
}

export function setAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return
  if (value) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, "1")
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}
