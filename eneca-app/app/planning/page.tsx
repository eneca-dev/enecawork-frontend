import type { Metadata } from "next"
import PlanningContent from "./planning-content"

export const metadata: Metadata = {
  title: "Планирование | ENECA Work",
  description: "Планирование ресурсов в ENECA Work",
}

export default function PlanningPage() {
  return <PlanningContent />
}

