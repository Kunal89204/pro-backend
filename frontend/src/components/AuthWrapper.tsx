"use client"
import { RootState } from '@/lib/store'
import { useRouter, usePathname } from 'next/navigation'
import  { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux'

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname() // Use usePathname() instead of window.location.pathname
  const isAuthenticated = useSelector((state: RootState) => state.isAuthenticated)

  useEffect(() => {
    // Redirect to /login if not authenticated and not on /login or /register
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      router.push('/login')
    }
  }, [isAuthenticated, pathname, router])

  // Allow rendering of /login and /register pages even if not authenticated
  if (!isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return children
  }

  // Prevent rendering content before redirection
  if (!isAuthenticated) {
    return null
  }

  return children
}

export default AuthWrapper
