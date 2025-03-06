import type { Metadata } from "next"
import { Suspense } from "react"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "Вход | ENECA Work",
  description: "Войдите в вашу учетную запись ENECA Work",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginFormSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-[350px] animate-pulse">
        <div className="space-y-2 mb-6">
          <div className="h-6 w-1/3 bg-muted rounded" />
          <div className="h-4 w-2/3 bg-muted rounded" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-1/4 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-1/4 bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded" />
          </div>
          <div className="h-10 w-full bg-primary/30 rounded" />
        </div>
      </div>
    </div>
  )
} 