import type { Metadata } from "next"
import HomeContent from "./home-content"

export const metadata: Metadata = {
  title: "ENECA Work",
  description: "Task Management System",
}

export default function Home() {
  return <HomeContent />
}

