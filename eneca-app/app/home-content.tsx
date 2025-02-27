"use client"

import { redirect } from "next/navigation"

export default function HomeContent() {
  redirect("/main")
  return null
}

