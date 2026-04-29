import React from 'react'
import { SignupForm } from '../components/auth/SignupForm'

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <SignupForm />
    </div>
  )
}

export default page