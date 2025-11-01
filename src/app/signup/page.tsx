import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20 flex items-center justify-center p-6 md:p-10">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/20 to-blue-400/20 blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
