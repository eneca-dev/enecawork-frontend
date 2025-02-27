import type { Metadata } from "next"
import MainContent from "../main-content"

export const metadata: Metadata = {
  title: "Main | ENECA Work",
  description: "Main page of ENECA Work Task Management System",
}

export default function MainPage() {
  return <MainContent />
}

