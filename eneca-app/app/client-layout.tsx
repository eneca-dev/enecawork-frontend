"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { SideNav } from "@/components/side-nav"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

// Array of public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/pending-verification",
  "/password-reset-sent",
]

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isPublicRoute = publicRoutes.includes(pathname)

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {!isPublicRoute && <Header />}
          <div className="flex">
            {!isPublicRoute && <SideNav />}
            <main className={`flex-1 ${isPublicRoute ? "" : "p-8"}`}>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

