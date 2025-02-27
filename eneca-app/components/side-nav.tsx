"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LayoutTemplate, Home } from "lucide-react"

const navigation = [
  {
    name: "Main",
    href: "/main",
    icon: Home,
  },
  {
    name: "Planning",
    href: "/planning",
    icon: LayoutTemplate,
  },
]

export function SideNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden ml-2">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <nav className="flex flex-col gap-2 p-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start">
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
      <nav className="hidden lg:flex flex-col gap-2 p-4 border-r min-h-[calc(100vh-4rem)] w-64">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start">
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
    </Sheet>
  )
}

