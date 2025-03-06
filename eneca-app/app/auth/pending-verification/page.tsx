"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PendingVerificationPage() {
  const router = useRouter()
  const email = typeof window !== "undefined" ? localStorage.getItem("pending-email") : null

  useEffect(() => {
    if (!email) {
      router.push("/auth/register")
    }
  }, [email, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Подтверждение Email</CardTitle>
          <CardDescription>Проверьте вашу почту</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            На вашу почту {email} отправлено письмо с подтверждением. Пожалуйста, проверьте вашу почту и перейдите по
            ссылке для завершения регистрации.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            После подтверждения email вы будете перенаправлены на страницу входа.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 