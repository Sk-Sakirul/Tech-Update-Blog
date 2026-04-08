import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AuthLayout({ children, authentication = true }) {
  const navigate   = useNavigate()
  const authStatus = useSelector((s) => s.auth.status)

  useEffect(() => {
    if (authentication && !authStatus) navigate('/') 
    else if (!authentication && authStatus) navigate('/')
  }, [authStatus, authentication, navigate])

  return <>{children}</>
}
