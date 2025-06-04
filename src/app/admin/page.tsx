'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react'

const adminCredentials = {
  username: 'admin',
  password: '123456'
}

interface ValidationErrors {
  username?: string
  password?: string
  general?: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)

  // Check if already logged in
  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (isAdmin === 'true') {
      router.push('/admin/dashboard')
    }
  }, [router])

  // Handle account lockout timer
  useEffect(() => {
    if (lockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setLockTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isLocked && lockTimeRemaining === 0) {
      setIsLocked(false)
      setAttemptCount(0)
    }
  }, [lockTimeRemaining, isLocked])

  const handleInputChange = (field: 'username' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: ValidationErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (isLocked) {
      setErrors({ general: `Akun terkunci. Coba lagi dalam ${Math.floor(lockTimeRemaining / 60)}:${(lockTimeRemaining % 60).toString().padStart(2, '0')} menit.` })
      return
    }

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      if (
        formData.username === adminCredentials.username &&
        formData.password === adminCredentials.password
      ) {
        // Set session storage
        sessionStorage.setItem('isAdmin', 'true')
        sessionStorage.setItem('adminLoginTime', new Date().toISOString())
        
        setAttemptCount(0)
        
        // Redirect to dashboard
        router.push('/admin/dashboard')
      } else {
        const newAttemptCount = attemptCount + 1
        setAttemptCount(newAttemptCount)

        if (newAttemptCount >= 3) {
          setIsLocked(true)
          setLockTimeRemaining(300)
          setErrors({ 
            general: 'Terlalu banyak percobaan login gagal. Akun dikunci selama 5 menit.' 
          })
        } else {
          setErrors({ 
            general: `Username atau password salah. Percobaan ${newAttemptCount}/3` 
          })
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrors({ general: 'Terjadi kesalahan sistem. Silakan coba lagi.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-sm">Masuk untuk mengakses dashboard</p>
          </div>

          <div className="space-y-4" onKeyPress={handleKeyPress}>
            {errors.general && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  disabled={isLoading || isLocked}
                  className={`w-full text-black pl-10 pr-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.username 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  placeholder="Masukkan username"
                />
              </div>
              {errors.username && (
                <p className="text-red-600 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  disabled={isLoading || isLocked}
                  className={`w-full text-black pl-10 pr-12 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isLocked}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading || isLocked}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : isLocked ? (
                'Akun Terkunci'
              ) : (
                'Masuk'
              )}
            </button>

            {attemptCount > 0 && !isLocked && (
              <div className="text-center">
                <p className="text-xs text-orange-600">
                  Percobaan gagal: {attemptCount}/3
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">© 2025 Admin Portal</p>
        </div>
      </div>
    </div>
  )
}