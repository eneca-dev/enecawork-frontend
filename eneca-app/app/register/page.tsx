import type { Metadata } from "next"
import RegisterForm from "./register-form"

export const metadata: Metadata = {
  title: "Регистрация | ENECA Work",
  description: "Создайте новую учетную запись в ENECA Work",
}

export default function RegisterPage() {
  return <RegisterForm />
}

