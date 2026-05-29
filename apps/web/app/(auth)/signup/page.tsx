"use client"

import { SignupForm } from "~/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden bg-slate-50">
      <div className="w-full max-w-md z-10">
        <SignupForm />
      </div>
    </div>
  )
}
