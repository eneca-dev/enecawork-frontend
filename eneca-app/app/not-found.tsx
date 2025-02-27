import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">We can't seem to find the page you're looking for.</p>
      <Button asChild>
        <Link href="/eneca.work/main">GO TO HOME PAGE</Link>
      </Button>
    </div>
  )
}

