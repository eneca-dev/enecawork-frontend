import type { Metadata } from "next"
import ForgotPasswordForm from "./forgot-password-form"

export const metadata: Metadata = {
  title: "Восстановление пароля | ENECA Work",
  description: "Восстановление пароля в ENECA Work",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}

