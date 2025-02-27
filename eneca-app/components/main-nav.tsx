"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HomeIcon, LayoutTemplateIcon as LayoutPlanIcon } from "lucide-react"

const modules = [
  {
    title: "Main",
    href: "/main",
    icon: HomeIcon,
  },
  {
    title: "Planning",
    href: "/planning",
    icon: LayoutPlanIcon,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col w-64 border-r min-h-screen p-4 space-y-2">
      {modules.map((module) => {
        const Icon = module.icon
        return (
          <Link key={module.href} href={module.href}>
            <Button variant={pathname === module.href ? "default" : "ghost"} className="w-full justify-start">
              <Icon className="mr-2 h-4 w-4" />
              {module.title}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

