"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { api } from "@/lib/api"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [redirectPath, setRedirectPath] = useState("/main")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const from = searchParams?.get("from")
    if (from) {
      setRedirectPath(from)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = await api.login({ email, password })

      // Set tokens in localStorage
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("refresh_token", data.refresh_token)
      localStorage.setItem("user_email", email)

      // Set token in cookie for middleware
      document.cookie = `auth-token=${data.access_token}; path=/; max-age=3600; SameSite=Strict`

      // Redirect to the original URL or main page
      window.location.href = redirectPath
    } catch (error) {
      setMessage("Ошибка при входе")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-8 text-primary">Добро пожаловать в eneca.work</h1>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Вход</CardTitle>
          <CardDescription>Войдите в вашу учетную запись</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message && <div className="text-sm text-red-500">{message}</div>}
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/register" className="text-sm text-blue-500 hover:underline">
            Нет аккаунта? Зарегистрироваться
          </Link>
          <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Забыли пароль?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

