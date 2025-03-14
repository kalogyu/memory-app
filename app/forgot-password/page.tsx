"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("请输入您的邮箱地址")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setIsSubmitted(true)
    } catch (err) {
      setError("发送重置链接失败，请稍后再试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E7E3] flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 pt-12 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => router.push("/login")}
          className="w-10 h-10 rounded-full bg-[#1A2E22] flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-5 h-5 text-[#8BAF92]" />
        </button>

        <h1 className="text-2xl font-bold">忘记密码</h1>
        <p className="text-sm text-[#8BAF92] mt-1">
          {!isSubmitted ? "输入您的邮箱，我们将发送重置密码的链接" : "重置链接已发送，请检查您的邮箱"}
        </p>
      </motion.header>

      {/* Form */}
      <motion.div
        className="flex-1 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-[#3C2A2A] text-[#E05252] p-3 rounded-lg text-sm">{error}</div>}

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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4CAF50] hover:bg-[#3d9c40] text-white h-12 rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  发送中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  发送重置链接 <Send className="ml-2 w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        ) : (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full bg-[#1A2E22] flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22 12.5V15C22 18.3137 22 20 20 20H4C2 20 2 18.3137 2 15V9C2 5.68629 2 4 4 4H20C22 4 22 5.68629 22 9V10.5"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 12.5L17.5 9.5L13 12.5"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 9L12 15L17.5 11.5"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold mb-2">邮件已发送</h2>
            <p className="text-[#8BAF92] mb-6">我们已向 {email} 发送了重置密码的链接，请检查您的邮箱</p>

            <Button
              onClick={() => router.push("/login")}
              className="bg-[#1A2E22] hover:bg-[#2A3C33] text-[#E0E7E3] h-12 rounded-xl px-6"
            >
              返回登录
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

