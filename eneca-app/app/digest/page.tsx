import type { Metadata } from "next"
import DigestContent from "./digest-content"

export const metadata: Metadata = {
  title: "Отчёты по проекту | ENECA Work",
  description: "Просмотр и анализ отчётов по проектам",
}

export default function DigestPage() {
  return <DigestContent />
} 