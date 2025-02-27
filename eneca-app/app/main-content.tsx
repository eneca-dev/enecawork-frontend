"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MainContent() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to ENECA Work!</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Welcome to your workspace. Choose a module from the side menu to begin.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

