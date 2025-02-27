import type { Metadata } from "next"
import ResetPasswordForm from "./reset-password-form"

export const metadata: Metadata = {
  title: "Сброс пароля | ENECA Work",
  description: "Сброс пароля в ENECA Work",
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}

