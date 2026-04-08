import { forwardRef } from 'react'

const Input = forwardRef(function Input({ type = 'text', className = '', ...props }, ref) {
  return (
    <input
      type={type}
      ref={ref}
      className={`input ${className}`}
      {...props}
    />
  )
})

export default Input
