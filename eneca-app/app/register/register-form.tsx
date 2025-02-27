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

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    department: "",
    team: "",
    position: "",
    email: "",
    password: "",
  })
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // No need to store unused data
        // Store email in localStorage for verification page
        localStorage.setItem("pending-email", formData.email)
        // Redirect to verification page
        router.push("/pending-verification")
      } else {
        const errorData = await response.json()
        setMessage(errorData.detail || "Ошибка при регистрации")
      }
    } catch (error) {
      console.error("Error during registration:", error)
      setMessage("Ошибка при регистрации")
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            {message && <div className="text-sm text-red-500">{message}</div>}
            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-blue-500 hover:underline">
            Есть аккаунт? Авторизоваться
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

