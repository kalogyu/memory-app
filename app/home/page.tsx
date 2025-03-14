"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { BookOpen, Brain, Award, Settings, Plus, ChevronRight, Search, Trophy } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [recentlyViewed, setRecentlyViewed] = useState([
    { id: "science", title: "科学知识", cards: 10, progress: 40 },
    { id: "history", title: "历史事件", cards: 15, progress: 25 },
  ])
  const [animateProgress, setAnimateProgress] = useState(false)

  const categories = [
    { id: "science", title: "科学知识", icon: <Brain className="w-5 h-5" />, cards: 10 },
    { id: "history", title: "历史事件", icon: <BookOpen className="w-5 h-5" />, cards: 15 },
    { id: "geography", title: "地理常识", icon: <BookOpen className="w-5 h-5" />, cards: 8 },
    { id: "language", title: "语言学习", icon: <BookOpen className="w-5 h-5" />, cards: 20 },
  ]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      setUser(JSON.parse(userData))

      // Trigger progress animation after component mounts
      setTimeout(() => {
        setAnimateProgress(true)
      }, 300)
    } catch {
      // If there's an error parsing the user data, redirect to login
      router.push("/login")
    }
  }, [router])

  // If user is not loaded yet, show nothing
  if (!user) return null

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E7E3]">
      {/* 顶部导航栏 */}
      <motion.header
        className="px-6 pt-12 pb-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold">你好，{user.name}</h1>
          <p className="text-sm text-[#8BAF92] mt-1">准备好提升记忆力了吗？</p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => router.push("/settings")}
            className="w-10 h-10 rounded-full bg-[#1A2E22] flex items-center justify-center mr-3"
          >
            <Settings className="w-5 h-5 text-[#8BAF92]" />
          </button>
          <button
            onClick={() => router.push("/profile")}
            className="w-10 h-10 rounded-full bg-[#2A3C33] flex items-center justify-center text-lg font-bold text-[#4CAF50] border-2 border-[#4CAF50]"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </motion.header>

      {/* 主内容区 */}
      <main className="px-6 pb-24">
        {/* 继续学习区域 */}
        {recentlyViewed.length > 0 && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h2 className="text-lg font-medium mb-4">继续学习</h2>
            <div className="space-y-3">
              {recentlyViewed.map((deck, index) => (
                <motion.div
                  key={deck.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/deck/${deck.id}`)}
                  className="bg-gradient-to-br from-[#1E3A2B] to-[#0F2318] rounded-2xl p-4 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">{deck.title}</h3>
                    <span className="text-xs text-[#8BAF92]">{deck.cards} 张卡片</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1A2E22] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#4CAF50] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: animateProgress ? `${deck.progress}%` : "0%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-[#8BAF92]">进度 {deck.progress}%</span>
                    <button className="text-xs text-[#4CAF50] font-medium flex items-center">
                      继续 <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 卡片集分类 */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">卡片集</h2>
            <button onClick={() => router.push("/create")} className="flex items-center text-xs text-[#4CAF50]">
              <Plus className="w-4 h-4 mr-1" /> 创建
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/deck/${category.id}`)}
                className="bg-[#1A2E22] rounded-2xl p-4 shadow-md flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#2A3C33] flex items-center justify-center mb-3">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-1">{category.title}</h3>
                  <p className="text-xs text-[#8BAF92]">{category.cards} 张卡片</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 学习统计 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-lg font-medium mb-4">学习统计</h2>
          <div className="bg-[#1A2E22] rounded-2xl p-5 shadow-md">
            <div className="flex justify-between mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-[#8BAF92] mt-1">已学习</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-[#8BAF92] mt-1">今日</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-[#8BAF92] mt-1">正确率</p>
              </div>
            </div>

            <div className="flex items-end h-24 gap-1">
              {[30, 45, 20, 60, 75, 50, 90].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <motion.div
                    className="w-full bg-[#4CAF50]/30 rounded-sm"
                    style={{ height: `${animateProgress ? height : 0}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                  >
                    <motion.div
                      className="w-full bg-[#4CAF50] rounded-sm"
                      style={{ height: `${height * 0.7}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height * 0.7}%` }}
                      transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    />
                  </motion.div>
                  <span className="text-xs text-[#8BAF92] mt-1">
                    {["一", "二", "三", "四", "五", "六", "日"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F1A14] border-t border-[#2A3C33] px-6 py-3 flex justify-around">
        <button className="flex flex-col items-center">
          <BookOpen className="w-6 h-6 text-[#4CAF50]" />
          <span className="text-xs mt-1 text-[#8BAF92]">学习</span>
        </button>
        <button onClick={() => router.push("/square")} className="flex flex-col items-center">
          <Award className="w-6 h-6 text-[#8BAF92]" />
          <span className="text-xs mt-1 text-[#8BAF92]">广场</span>
        </button>
        <button onClick={() => router.push("/explore")} className="flex flex-col items-center">
          <Search className="w-6 h-6 text-[#8BAF92]" />
          <span className="text-xs mt-1 text-[#8BAF92]">探索</span>
        </button>
        <button onClick={() => router.push("/stats")} className="flex flex-col items-center">
          <Trophy className="w-6 h-6 text-[#8BAF92]" />
          <span className="text-xs mt-1 text-[#8BAF92]">统计</span>
        </button>
      </nav>
    </div>
  )
}

