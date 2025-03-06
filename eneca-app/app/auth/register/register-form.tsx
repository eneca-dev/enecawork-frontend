"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { API_URL } from "@/lib/config"
import { api } from "@/lib/api"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    department: "",
    team: "",
    position: "",
    category: "",
    email: "",
    password: "",
    password_confirm: "",
  })
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.password_confirm) {
      setMessage("Пароли не совпадают")
      return
    }

    try {
      const { password_confirm, ...dataToSend } = formData
      
      console.log("Отправляемые данные:", dataToSend)
      console.log("Категория:", dataToSend.category)
      
      await api.register(dataToSend)
      localStorage.setItem("pending-email", formData.email)
      router.push("/auth/pending-verification")
    } catch (error: any) {
      console.error("Error during registration:", error)
      
      // Попытка извлечь сообщение об ошибке из объекта ошибки
      if (error.message && typeof error.message === "string") {
        setMessage(error.message)
      } else {
        setMessage("Ошибка при регистрации")
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>Создайте новую учетную запись</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Имя</Label>
              <Input id="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Фамилия</Label>
              <Input id="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Отдел</Label>
              <Input id="department" value={formData.department} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Команда</Label>
              <Input id="team" value={formData.team} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Должность</Label>
              <Input id="position" value={formData.position} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Input id="category" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirm">Подтверждение пароля</Label>
              <Input
                id="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                required
              />
            </div>
            {message && <div className="text-sm text-red-500">{message}</div>}
            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login" className="text-sm text-blue-500 hover:underline">
            Есть аккаунт? Авторизоваться
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 