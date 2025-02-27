"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

interface Tokens {
  access_token: string
  refresh_token: string
}

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"error" | "success">("success")
  const [tokens, setTokens] = useState<Tokens | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Получаем токены из URL hash
    const hashFragment = window.location.hash.substring(1) // Убираем # из начала

    try {
      if (!hashFragment) {
        throw new Error("Hash fragment is empty")
      }

      const params = new URLSearchParams(hashFragment)
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")

      if (!accessToken || !refreshToken) {
        throw new Error("Missing required tokens")
      }

      setTokens({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    } catch (e) {
      showMessage("Ошибка при получении токенов из URL. Проверьте корректность ссылки.", "error")
    }
  }, [])

  const showMessage = (text: string, type: "error" | "success") => {
    setMessage(text)
    setMessageType(type)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showMessage("Пароли не совпадают", "error")
      return
    }

    if (!tokens) {
      showMessage("Ошибка при получении токенов из URL", "error")
      return
    }

    try {
      await api.updatePassword({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        new_password: password,
      })

      showMessage("Пароль успешно обновлен", "success")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      if (error instanceof Error) {
        showMessage(error.message, "error")
      } else {
        showMessage("Ошибка при обновлении пароля", "error")
      }
    }
  }

  // Если токены не найдены, показываем сообщение об ошибке
  if (!tokens && message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Ошибка сброса пароля</CardTitle>
            <CardDescription>Недействительная или истекшая ссылка для сброса пароля</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-500 mb-4">{message}</div>
            <Button onClick={() => router.push("/forgot-password")} className="w-full">
              Запросить новую ссылку
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Сброс пароля</CardTitle>
          <CardDescription>Введите новый пароль</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {message && (
              <div className={`text-sm ${messageType === "error" ? "text-red-500" : "text-green-500"}`}>{message}</div>
            )}
            <Button type="submit" className="w-full">
              Сбросить пароль
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

