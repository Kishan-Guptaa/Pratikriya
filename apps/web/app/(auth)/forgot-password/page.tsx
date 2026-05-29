import { ForgotPasswordForm } from "~/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden bg-slate-50">
      <div className="w-full max-w-md z-10">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
