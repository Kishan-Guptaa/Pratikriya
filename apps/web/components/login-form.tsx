"use client"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useForm } from "react-hook-form"
import { useSignIn, useSignup } from "~/hooks/api/auth"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"

interface LoginFormInputs {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signInUserWithEmailAndPasswordAsync } = useSignIn();
  const { createUserWithEmailAndPasswordAsync } = useSignup();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError(null);
    setIsSubmitting(true);
    try {
      const { id } = await signInUserWithEmailAndPasswordAsync({
        email: data.email,
        password: data.password
      });

      router.replace('/dashboard');
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("no user found") || msg.toLowerCase().includes("not found")) {
        setLoginError("This user does not exist. Please check your email or sign up!");
      } else if (msg.toLowerCase().includes("invalid email address or password") || msg.toLowerCase().includes("password") || msg.toLowerCase().includes("incorrect")) {
        setLoginError("Incorrect password. Please verify and try again!");
      } else {
        setLoginError("Invalid credentials. Please verify your email and password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleMockOAuth = async (provider: 'google' | 'github') => {
    const email = `${provider}.demo@pratikriya.app`;
    const fullName = `${provider === 'google' ? 'Google' : 'GitHub'} User`;
    const password = `MockOAuthPassword_${provider}_123!`;

    setLoginError(null);
    setIsSubmitting(true);
    try {
      try {
        await signInUserWithEmailAndPasswordAsync({
          email,
          password
        });
        router.replace('/dashboard');
      } catch (err: any) {
        const msg = err?.message || "";
        if (msg.toLowerCase().includes("no user found") || msg.toLowerCase().includes("not found")) {
          // Create the user first, then sign in
          await createUserWithEmailAndPasswordAsync({
            fullName,
            email,
            password
          });
          await signInUserWithEmailAndPasswordAsync({
            email,
            password
          });
          router.replace('/dashboard');
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(`Failed to authenticate with ${provider === 'google' ? 'Google' : 'GitHub'}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden p-0 scribble-border scribble-shadow bg-white rounded-3xl">
        <CardContent className="p-0">
          <form className="p-5 md:p-6 flex flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-3.5">
              <div className="flex flex-col items-center gap-1 text-center mb-3">
                <h1 className="text-3xl font-bold font-caveat tracking-wider text-slate-800">Welcome back</h1>
                <p className="text-balance text-slate-500 font-sans font-semibold text-sm">
                  Login to your Pratikriya account
                </p>
              </div>

              {loginError && (
                <div className="rounded-xl border-2 border-foreground bg-rose-50 p-3 text-xs font-bold text-rose-600 flex items-center gap-2 shadow-[2px_2px_0px_#000] animate-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <Field className="gap-1.5">
                <FieldLabel htmlFor="email" className="text-sm">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="h-10 text-base"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email.message}</span>
                )}
              </Field>
              <Field className="gap-1.5">
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-sm">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-10 text-base pr-11"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-sm text-red-500">{errors.password.message}</span>
                )}
              </Field>
              <Field>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="scribble-btn bg-pastel-blue hover:bg-blue-200 text-[#2d2638] h-10 w-full text-base mt-1 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
              <FieldSeparator className="text-xs *:data-[slot=field-separator-content]:bg-white py-1">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="h-9 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => handleMockOAuth('google')}
                  disabled={isSubmitting}
                >
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="font-semibold text-xs text-slate-700">Google</span>
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="h-9 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => handleMockOAuth('github')}
                  disabled={isSubmitting}
                >
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="font-semibold text-xs text-slate-700">GitHub</span>
                </Button>
              </Field>
              <FieldDescription className="text-center font-semibold mt-1 text-slate-600 text-sm">
                Don&apos;t have an account? <a href="/signup" className="text-[#7b61ff] underline font-bold">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
