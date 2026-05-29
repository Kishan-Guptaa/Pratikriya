"use client"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { IconCheck } from "@tabler/icons-react"
import { useForm } from "react-hook-form"
import { useForgotPassword } from "~/hooks/api/auth"
import { useState } from "react"

interface ForgotPasswordFormInputs {
  email: string
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { forgotPasswordAsync } = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormInputs>({
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async(data: ForgotPasswordFormInputs) => {
    try {
      await forgotPasswordAsync({ email: data.email });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <Card className="overflow-hidden p-0 scribble-border scribble-shadow bg-white rounded-3xl">
        <CardContent className="p-0">
          {submitted ? (
            <div className="p-4 md:p-5 flex flex-col justify-center items-center text-center">
              <div className="flex size-9 items-center justify-center rounded-full bg-pastel-green border-2 border-[#2d2638] shadow-[2px_2px_0px_#2d2638] mb-2">
                <IconCheck className="size-5 text-[#2d2638]" />
              </div>
              <h1 className="text-xl font-bold font-caveat tracking-wider text-slate-800">Check Your Email</h1>
              <p className="text-balance text-slate-500 font-sans font-semibold text-[11px] mt-1">
                If an account exists for that email, we have sent password reset instructions.
              </p>
              <Button asChild variant="outline" className="mt-3.5 border-[#2d2638] text-[#2d2638] font-bold h-8 text-xs">
                <a href="/login">Return to Login</a>
              </Button>
            </div>
          ) : (
            <form className="p-4 md:p-5 flex flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="gap-3.5">
                <div className="flex flex-col items-center gap-0.5 text-center mb-1">
                  <h1 className="text-xl font-bold font-caveat tracking-wider text-slate-800">Forgot Password</h1>
                  <p className="text-balance text-slate-500 font-sans font-semibold text-[11px]">
                    Enter your email to receive a reset link
                  </p>
                </div>
                <Field className="gap-1">
                  <FieldLabel htmlFor="email" className="text-[11px] font-bold">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="h-8.5 text-xs"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-500">{errors.email.message}</span>
                  )}
                </Field>
                <Field>
                  <Button type="submit" className="scribble-btn bg-pastel-pink hover:bg-pink-200 text-[#2d2638] h-8.5 w-full text-sm mt-0.5">Send Reset Link</Button>
                </Field>
                <FieldDescription className="text-center font-semibold mt-0.5 text-slate-600 text-[11px]">
                  Remember your password? <a href="/login" className="text-[#7b61ff] underline font-bold">Log in</a>
                </FieldDescription>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
