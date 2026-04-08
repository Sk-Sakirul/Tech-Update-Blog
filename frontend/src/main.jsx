import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from './components'
import { Home, AddPost, EditPost, ViewPost, Drafts, Dashboard, NotFound } from './pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'dashboard',
        element: <AuthLayout authentication><Dashboard /></AuthLayout>,
      },
      {
        path: 'drafts',
        element: <AuthLayout authentication><Drafts /></AuthLayout>,
      },
      {
        path: 'add-post',
        element: <AuthLayout authentication><AddPost /></AuthLayout>,
      },
      {
        path: 'edit-post/:slug',
        element: <AuthLayout authentication><EditPost /></AuthLayout>,
      },
      { path: 'post/:slug', element: <ViewPost /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
