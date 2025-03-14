"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Github, Twitter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password) {
      setError("请填写所有字段")
      return
    }

    if (!agreeTerms) {
      setError("请同意服务条款和隐私政策")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll just store a simple user object in localStorage
      localStorage.setItem("user", JSON.stringify({ email, name }))

      // Redirect to home page
      router.push("/home")
    } catch (err) {
      setError("注册失败，请稍后再试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E7E3] flex flex-col">
      {/* Header with logo */}
      <motion.header
        className="pt-16 pb-8 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-[#1A2E22] flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 9.25C22 12.5302 19.3923 15.25 16 15.25C12.6077 15.25 10 12.5302 10 9.25C10 5.96979 12.6077 3.25 16 3.25C19.3923 3.25 22 5.96979 22 9.25Z"
              stroke="#4CAF50"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 20.25C14 20.25 7.5 18.25 7.5 12.25V4.75L14 2.25"
              stroke="#4CAF50"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.5 7.25L2 9.25V16.75L7.5 18.75"
              stroke="#4CAF50"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">创建账户</h1>
        <p className="text-sm text-[#8BAF92] mt-1">开始您的记忆提升之旅</p>
      </motion.header>

      {/* Registration form */}
      <motion.div
        className="flex-1 px-6 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <form onSubmit={handleRegister} className="space-y-5">
          {error && <div className="bg-[#3C2A2A] text-[#E05252] p-3 rounded-lg text-sm">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm text-[#8BAF92]" htmlFor="name">
              姓名
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="您的姓名"
              className="bg-[#1A2E22] border-[#2A3C33] focus-visible:ring-[#4CAF50] text-[#E0E7E3]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#8BAF92]" htmlFor="email">
              邮箱
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-[#1A2E22] border-[#2A3C33] focus-visible:ring-[#4CAF50] text-[#E0E7E3]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[#8BAF92]" htmlFor="password">
              密码
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少8个字符"
                className="bg-[#1A2E22] border-[#2A3C33] focus-visible:ring-[#4CAF50] text-[#E0E7E3] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8BAF92]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50]"
            />
            <label htmlFor="terms" className="text-sm text-[#8BAF92] leading-tight">
              我同意{" "}
              <a href="#" className="text-[#4CAF50]">
                服务条款
              </a>{" "}
              和{" "}
              <a href="#" className="text-[#4CAF50]">
                隐私政策
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4CAF50] hover:bg-[#3d9c40] text-white h-12 rounded-xl mt-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                注册中...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                创建账户 <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            )}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A3C33]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#121212] text-[#8BAF92]">或使用以下方式注册</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-2.5 border border-[#2A3C33] rounded-xl hover:bg-[#1A2E22] transition-colors">
              <Github className="w-5 h-5 mr-2" />
              <span>Github</span>
            </button>
            <button className="flex items-center justify-center py-2.5 border border-[#2A3C33] rounded-xl hover:bg-[#1A2E22] transition-colors">
              <Twitter className="w-5 h-5 mr-2" />
              <span>Twitter</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#8BAF92]">
            已有账户?{" "}
            <button onClick={() => router.push("/login")} className="text-[#4CAF50] font-medium">
              登录
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

