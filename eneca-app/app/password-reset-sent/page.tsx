import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Инструкции отправлены | ENECA Work",
  description: "Инструкции по сбросу пароля отправлены",
}

export default function PasswordResetSentPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Инструкции отправлены</CardTitle>
          <CardDescription>Проверьте вашу почту</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Если указанный email зарегистрирован в системе, мы отправили на него инструкции по сбросу пароля.
            Пожалуйста, проверьте вашу почту и следуйте инструкциям в письме.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Если вы не получили письмо, проверьте папку "Спам" или попробуйте запросить сброс пароля еще раз.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/login">Вернуться на страницу входа</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

