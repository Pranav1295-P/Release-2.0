import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// 1. Grab your Vercel/Local environment variable dynamically
const API_BASE = import.meta.env.VITE_API_URL || ''

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])

  // 2. FIXED LOGIN: Explicitly points to `${API_BASE}/api/auth/login`
  const login = async (username, password) => {
    const response = await axios.post(`${API_BASE}/api/auth/login`, { username, password })
    const { token: newToken, user: userData } = response.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return response.data
  }

  // 3. FIXED REGISTER: Explicitly points to `${API_BASE}/api/auth/register`
  const register = async (username, password) => {
    const response = await axios.post(`${API_BASE}/api/auth/register`, { username, password })
    const { token: newToken, user: userData } = response.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
