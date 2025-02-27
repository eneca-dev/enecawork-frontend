import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./client-layout"

export const metadata: Metadata = {
  title: "ENECA Work",
  description: "Task Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}

