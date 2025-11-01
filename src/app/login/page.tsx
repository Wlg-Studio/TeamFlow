import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 dark:bg-gradient-to-br flex items-center justify-center p-6 md:p-10">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 animate-pulse rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-indigo-500/10 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
