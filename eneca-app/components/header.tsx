"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut, User } from "lucide-react"
import { API_URL } from "@/lib/config"
import { api } from "@/lib/api"

interface UserProfile {
  first_name: string
  last_name: string
  position: string
}

export function Header() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await api.getUserProfile()
        setUserProfile({
          first_name: profile.first_name,
          last_name: profile.last_name,
          position: profile.position,
        })
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token")

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_email")

        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

        router.push("/auth/login")
      } else {
        console.error("Ошибка при выходе из системы")
      }
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error)
    }
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <Link href="/main" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enecawork_logo-shbz0yaANvciBbCNWFGv8DzIYpazaL.png"
            alt="ENECA.work Logo"
            width={250}
            height={70}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <div className="flex items-center gap-4">
          {userProfile && (
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {`${userProfile.first_name} ${userProfile.last_name}, ${userProfile.position}`}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

