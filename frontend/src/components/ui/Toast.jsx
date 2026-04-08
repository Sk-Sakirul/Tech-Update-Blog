// Centralised toast helper so all toasts share the same config
import { toast } from 'react-toastify'

const getTheme = () =>
  (localStorage.getItem('theme') ?? 'light') === 'dark' ? 'dark' : 'light'

const base = (type, msg, opts = {}) =>
  toast[type](msg, {
    position: 'top-right',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: getTheme(),
    ...opts,
  })

export const toastSuccess = (msg, opts) => base('success', msg, opts)
export const toastError   = (msg, opts) => base('error',   msg, opts)
export const toastInfo    = (msg, opts) => base('info',    msg, opts)
