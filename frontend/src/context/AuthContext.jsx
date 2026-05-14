import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  // Restore user from localStorage on first mount so refreshing the page
  // doesn't log the user out.
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { }
    }
  }, [])

  // Persist a successful auth result (login / register-verify / reset)
  const applySession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }

  /* ── Login (username + password) ── */
  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    return applySession(data)
  }

  /* ── Registration: step 1 — request an OTP to an email ── */
  const requestRegisterOtp = async (email) => {
    const { data } = await api.post('/auth/register/request-otp', { email })
    return data
  }

  /* ── Registration: step 2 — verify OTP + create account ── */
  const verifyRegister = async ({ email, code, username, password }) => {
    const { data } = await api.post('/auth/register/verify', {
      email,
      code,
      username,
      password,
    })
    return applySession(data)
  }

  /* ── Forgot password: step 1 — request a reset OTP ── */
  const requestPasswordReset = async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  }

  /* ── Forgot password: step 2 — verify OTP + set new password ── */
  const resetPassword = async ({ email, code, password }) => {
    const { data } = await api.post('/auth/reset-password', {
      email,
      code,
      password,
    })
    return applySession(data)
  }

  /* ── Forgot username — emails the username to the account holder ── */
  const recoverUsername = async (email) => {
    const { data } = await api.post('/auth/recover-username', { email })
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        requestRegisterOtp,
        verifyRegister,
        requestPasswordReset,
        resetPassword,
        recoverUsername,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
