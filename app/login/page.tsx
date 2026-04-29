import React from 'react'
import { LoginForm } from '../components/auth/LoginForm'

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <LoginForm />
    </div>
  )
}

export default page