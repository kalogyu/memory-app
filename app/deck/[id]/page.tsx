"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { ArrowLeft, Share2 } from "lucide-react"
import { addPoints, addRewardHistory, saveUserRewards, getUserRewards } from "@/lib/rewards"
import { RewardNotification } from "@/components/reward-notification"

// 模拟数据库
const decks = {
  science: {
    title: "科学知识",
    cards: [
      {
        id: 1,
        front: "什么是光合作用？",
        back: "光合作用是绿色植物利用光能，将二氧化碳和水转化为有机物和氧气的过程。",
      },
      { id: 2, front: "水的化学式是什么？", back: "H₂O" },
      { id: 3, front: "地球上最高的山峰是什么？", back: "珠穆朗玛峰，海拔8,848.86米" },
      { id: 4, front: "人体最大的器官是什么？", back: "皮肤" },
      { id: 5, front: "谁发明了电话？", back: "亚历山大·格雷厄姆·贝尔" },
      { id: 6, front: "DNA的全称是什么？", back: "脱氧核糖核酸" },
      { id: 7, front: "太阳系中最大的行星是什么？", back: "木星" },
      { id: 8, front: "人体中的红血细胞寿命约为多久？", back: "约120天" },
      { id: 9, front: "声音在空气中的传播速度约为多少？", back: "约340米/秒" },
      { id: 10, front: "元素周期表中的第一个元素是什么？", back: "氢(H)" },
    ],
  },
  history: {
    title: "历史事件",
    cards: [
      { id: 1, front: "第一次世界大战的开始年份是？", back: "1914年" },
      { id: 2, front: "中国改革开放的年份是？", back: "1978年" },
      { id: 3, front: "美国独立宣言签署的年份是？", back: "1776年" },
      { id: 4, front: "法国大革命爆发的年份是？", back: "1789年" },
      { id: 5, front: "秦始皇统一中国的年份是？", back: "公元前221年" },
      { id: 6, front: "第二次世界大战结束的年份是？", back: "1945年" },
      { id: 7, front: "马克思和恩格斯发表《共产党宣言》的年份是？", back: "1848年" },
      { id: 8, front: "人类首次登月的年份是？", back: "1969年" },
      { id: 9, front: "柏林墙倒塌的年份是？", back: "1989年" },
      { id: 10, front: "中华人民共和国成立的年份是？", back: "1949年" },
      { id: 11, front: "拿破仑称帝的年份是？", back: "1804年" },
      { id: 12, front: "文艺复兴大致的时间段是？", back: "14世纪至17世纪" },
      { id: 13, front: "清朝灭亡的年份是？", back: "1912年" },
      { id: 14, front: "甲午战争爆发的年份是？", back: "1894年" },
      { id: 15, front: "第一次鸦片战争爆发的年份是？", back: "1840年" },
    ],
  },
  geography: {
    title: "地理常识",
    cards: [
      { id: 1, front: "世界上最大的大洲是？", back: "亚洲" },
      { id: 2, front: "世界上最大的海洋是？", back: "太平洋" },
      { id: 3, front: "中国的首都是？", back: "北京" },
      { id: 4, front: "世界上最长的河流是？", back: "尼罗河" },
      { id: 5, front: "世界上最大的沙漠是？", back: "撒哈拉沙漠" },
      { id: 6, front: "世界上最高的瀑布是？", back: "安赫尔瀑布" },
      { id: 7, front: "世界上最深的海沟是？", back: "马里亚纳海沟" },
      { id: 8, front: "中国最长的河流是？", back: "长江" },
    ],
  },
  language: {
    title: "语言学习",
    cards: [
      { id: 1, front: "英语单词'Apple'的中文意思是？", back: "苹果" },
      { id: 2, front: "英语单词'Book'的中文意思是？", back: "书" },
      { id: 3, front: "英语单词'Cat'的中文意思是？", back: "猫" },
      { id: 4, front: "英语单词'Dog'的中文意思是？", back: "狗" },
      { id: 5, front: "英语单词'Elephant'的中文意思是？", back: "大象" },
      { id: 6, front: "英语单词'Flower'的中文意思是？", back: "花" },
      { id: 7, front: "英语单词'Garden'的中文意思是？", back: "花园" },
      { id: 8, front: "英语单词'House'的中文意思是？", back: "房子" },
      { id: 9, front: "英语单词'Island'的中文意思是？", back: "岛屿" },
      { id: 10, front: "英语单词'Jacket'的中文意思是？", back: "夹克" },
      { id: 11, front: "英语单词'Kitchen'的中文意思是？", back: "厨房" },
      { id: 12, front: "英语单词'Lemon'的中文意思是？", back: "柠檬" },
      { id: 13, front: "英语单词'Mountain'的中文意思是？", back: "山" },
      { id: 14, front: "英语单词'Night'的中文意思是？", back: "夜晚" },
      { id: 15, front: "���语单词'Ocean'的中文意思是？", back: "海洋" },
      { id: 16, front: "英语单词'Pencil'的中文意思是？", back: "铅笔" },
      { id: 17, front: "英语单词'Queen'的中文意思是？", back: "女王" },
      { id: 18, front: "英语单词'River'的中文意思是？", back: "河流" },
      { id: 19, front: "英语单词'Sun'的中文意思是？", back: "太阳" },
      { id: 20, front: "英语单词'Tree'的中文意思是？", back: "树" },
    ],
  },
}

interface UserData {
  name: string
  email?: string
}

export default function DeckPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const deckId = params.id
  const deck = decks[deckId as keyof typeof decks]

  // 初始化所有hooks，即使deck可能不存在
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [animateProgress, setAnimateProgress] = useState(false)
  const [rewardNotification, setRewardNotification] = useState<{
    show: boolean
    points: number
    message: string
    levelUp: boolean
    newLevel?: { level: number; title: string }
  } | null>(null)

  // 初始化flipped状态，如果deck不存在则使用空数组
  const [flipped, setFlipped] = useState<boolean[]>([])

  // 用于控制卡片的位置
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // 计算拖动距离
  const dragDistance = useRef({ x: 0, y: 0 })

  // 根据位置计算透明度 - 基于垂直距离
  const opacity = useTransform(y, [0, -150], [1, 0])

  // 根据位置计算缩放和旋转 - 添加一些倾斜效果
  const scale = useTransform(y, [0, -100], [1, 0.95])
  const rotate = useTransform(x, [-100, 0, 100], [-5, 0, 5])

  // 获取当前用户
  const getUser = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user")
        return userData ? (JSON.parse(userData) as UserData) : { name: "用户" }
      }
      return { name: "用户" }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
      return { name: "用户" } // Provide a default value in case of parsing errors
    }
  }, [])

  const [user, setUser] = useState<UserData>({ name: "用户" })

  useEffect(() => {
    setUser(getUser())
  }, [getUser])

  // 如果找不到卡片集，返回首页
  useEffect(() => {
    if (!deck) {
      router.push("/")
      return
    }

    // 初始化flipped状态
    setFlipped(new Array(deck.cards.length).fill(false))

    // Trigger progress animation after component mounts
    setTimeout(() => {
      setAnimateProgress(true)
    }, 300)
  }, [deck, router])

  // 如果找不到卡片集，提前返回
  if (!deck) return null

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = (_: unknown, info: PanInfo) => {
    // 允许任何方向的拖动，但记录位置
    x.set(info.offset.x)
    y.set(info.offset.y)

    // 更新拖动距离
    dragDistance.current = {
      x: info.offset.x,
      y: info.offset.y,
    }
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false)

    // 检测是否是向上方向的滑动（包括左上和右上）
    const VERTICAL_THRESHOLD = -60 // 降低阈值，使滑动更容易

    let updatedRewards = null // Initialize outside the if block
    if (info.offset.y < VERTICAL_THRESHOLD && currentIndex < deck.cards.length - 1) {
      // 设置过渡状态，防止动画冲突
      setIsTransitioning(true)

      // 如果当前卡片是翻转状态，移动到下一张时重置翻转状态
      if (flipped[currentIndex]) {
        const newFlipped = [...flipped]
        newFlipped[currentIndex] = false
        setFlipped(newFlipped)
      }

      // 延迟设置新的索引，让当前卡片完成消失动画
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
        // 重置所有动画状态
        x.set(0)
        y.set(0)
        dragDistance.current = { x: 0, y: 0 }

        // 延迟结束过渡状态，确保新卡片已经渲染
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 200)

      // 如果是有效的向上滑动，给予奖励
      if (info.offset.y < VERTICAL_THRESHOLD) {
        // 添加完成卡片的奖励
        const userRewards = getUserRewards()

        updatedRewards = userRewards
          ? addPoints(userRewards, "COMPLETE_CARD")
          : { pointsAdded: 0, leveledUp: false, action: "COMPLETE_CARD" }
        const rewardsWithHistory = userRewards
          ? addRewardHistory(updatedRewards, "COMPLETE_CARD")
          : { ...updatedRewards, rewardHistory: [] }
        if (userRewards) {
          saveUserRewards(rewardsWithHistory)
        }
      }
    } else {
      // 如果不是有效的滑动，重置位置
      x.set(0)
      y.set(0)
    }

    // 检查是否是最后一张卡片
    if (currentIndex === deck.cards.length - 1 && info.offset.y < VERTICAL_THRESHOLD) {
      // 显示完成模态框
      setShowCompleteModal(true)

      // 添加完成卡片集的奖励
      const userRewards = getUserRewards()

      updatedRewards = userRewards
        ? addPoints(userRewards, "COMPLETE_DECK")
        : { pointsAdded: 0, leveledUp: false, action: "COMPLETE_DECK" }
      const rewardsWithHistory = userRewards
        ? addRewardHistory(updatedRewards, "COMPLETE_DECK")
        : { ...updatedRewards, rewardHistory: [] }
      if (userRewards) {
        saveUserRewards(rewardsWithHistory)
      }

      // 完成卡片集的奖励通知会在模态框关闭后显示
      // setTimeout(() => {
      //   setRewardNotification({
      //     show: true,
      //     points: updatedRewards.pointsAdded,
      //     message: updatedRewards.action,
      //     levelUp: updatedRewards.leveledUp,
      //     newLevel: updatedRewards.leveledUp ? updatedRewards.newLevel : undefined,
      //   });
      // }, 500);
    }

    // 显示奖励通知
    if (updatedRewards) {
      setRewardNotification({
        show: true,
        points: updatedRewards.pointsAdded,
        message: updatedRewards.action,
        levelUp: updatedRewards.leveledUp,
        newLevel: updatedRewards.leveledUp ? updatedRewards.newLevel : undefined,
      })
    }
  }

  const toggleFlip = (index: number) => {
    // 只有当拖动距离很小时才视为点击
    const isClick = Math.abs(dragDistance.current.x) < 10 && Math.abs(dragDistance.current.y) < 10

    if (!isDragging && isClick) {
      const newFlipped = [...flipped]
      newFlipped[index] = !newFlipped[index]
      setFlipped(newFlipped)
    }
  }

  // 重置位置
  useEffect(() => {
    x.set(0)
    y.set(0)
    dragDistance.current = { x: 0, y: 0 }
  }, [currentIndex, x, y])

  // 计算进度百分比
  const progressPercentage = (currentIndex / (deck.cards.length - 1)) * 100

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#E0E7E3]">
      {/* 顶部导航栏 */}
      <header className="px-6 pt-12 pb-4 flex justify-between items-center">
        <button
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full bg-[#1A2E22] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#8BAF92]" />
        </button>
        <h1 className="text-xl font-bold">{deck.title}</h1>
        <button
          onClick={() => router.push("/profile")}
          className="w-10 h-10 rounded-full bg-[#2A3C33] flex items-center justify-center text-lg font-bold text-[#4CAF50]"
        >
          {user.name.charAt(0).toUpperCase()}
        </button>
      </header>

      {/* 顶部进度条 */}
      <div className="px-4">
        <Progress
          value={animateProgress ? progressPercentage : 0}
          className="h-1 bg-[#1E2A23] [&>div]:bg-[#4CAF50] [&>div]:transition-all [&>div]:duration-1000"
        />
        <div className="flex justify-between text-xs text-[#8BAF92] mt-1 px-1">
          <span>
            {currentIndex + 1}/{deck.cards.length}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* 卡片区域 */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="relative w-full max-w-md h-[60vh] perspective-1000">
          <div className="relative w-full h-full">
            {/* 下一张卡片（如果有且不在过渡状态） */}
            {currentIndex < deck.cards.length - 1 && !isTransitioning && (
              <div className="absolute w-full h-full rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-[#1A2E22] p-8 flex flex-col justify-center items-center transform scale-[0.92] translate-y-[15px] opacity-50 z-5">
                <div className="text-2xl font-medium text-center text-[#E0E7E3]">
                  {deck.cards[currentIndex + 1].front}
                </div>
              </div>
            )}

            {/* 当前卡片 */}
            <motion.div
              style={{
                x,
                y,
                opacity: opacity,
                scale,
                rotate: flipped[currentIndex] ? 0 : rotate,
                zIndex: 10,
              }}
              drag={!isTransitioning} // 过渡期间禁用拖动
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onClick={() => toggleFlip(currentIndex)}
              className="absolute w-full h-full cursor-pointer touch-manipulation"
            >
              <div
                className={`relative w-full h-full rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 ${flipped[currentIndex] ? "rotate-y-180" : ""}`}
              >
                {/* 卡片正面 */}
                <div
                  className={`absolute w-full h-full bg-gradient-to-br from-[#1E3A2B] to-[#0F2318] rounded-3xl p-8 flex flex-col justify-center items-center backface-hidden ${flipped[currentIndex] ? "opacity-0" : "opacity-100"}`}
                >
                  <div className="text-3xl font-medium text-center text-[#E0E7E3]">
                    {deck.cards[currentIndex].front}
                  </div>

                  {/* 微妙的滑动指示器 - 只是一个小箭头 */}
                  <div className="absolute bottom-6 inset-x-0 flex justify-center">
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                      className="w-8 h-8 rounded-full bg-[#2A3C33]/40 flex items-center justify-center"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 5L12 19M12 5L6 11M12 5L18 11"
                          stroke="#8BAF92"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* 卡片背面 */}
                <div
                  className={`absolute w-full h-full bg-gradient-to-br from-[#2D4F3C] to-[#1A2E22] text-[#E0E7E3] rounded-3xl p-8 flex flex-col justify-center items-center backface-hidden rotate-y-180 ${flipped[currentIndex] ? "opacity-100" : "opacity-0"}`}
                >
                  <div className="text-xl text-center">{deck.cards[currentIndex].back}</div>

                  {/* 背面添加一个微妙的装饰元素 */}
                  <div className="absolute bottom-6 right-6 opacity-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#8BAF92"
                        strokeWidth="2"
                      />
                      <path d="M12 16V12M12 8H12.01" stroke="#8BAF92" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 底部指示器 */}
      <div className="pb-8 flex items-center justify-center space-x-1.5">
        {deck.cards.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-[#4CAF50] w-6"
                : index < currentIndex
                  ? "bg-[#4CAF50]/30 w-1.5"
                  : "bg-[#2A3C33] w-1.5"
            }`}
          />
        ))}
      </div>

      {/* 完成学习模态框 */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A2E22] rounded-3xl p-8 w-full max-w-sm shadow-xl"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#2D4F3C] flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">恭喜！</h2>
              <p className="text-center text-[#8BAF92] mb-6">你已完成本组卡片的学习。继续保持，提升你的记忆力！</p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={() => {
                    setShowCompleteModal(false)
                    setCurrentIndex(0)
                    setFlipped(new Array(deck.cards.length).fill(false))
                  }}
                  className="w-full py-3 bg-[#4CAF50] rounded-xl font-medium"
                >
                  再学一次
                </button>
                <button
                  onClick={() => router.push("/home")}
                  className="w-full py-3 bg-[#2A3C33] rounded-xl font-medium text-[#8BAF92]"
                >
                  返回首页
                </button>
                <button
                  onClick={() => {
                    // 添加分享成果的奖励
                    const userRewards = getUserRewards()

                    const updatedRewards = userRewards
                      ? addPoints(userRewards, "SHARE_RESULT")
                      : { pointsAdded: 0, leveledUp: false, action: "SHARE_RESULT" }
                    const rewardsWithHistory = userRewards
                      ? addRewardHistory(updatedRewards, "SHARE_RESULT")
                      : { ...updatedRewards, rewardHistory: [] }
                    if (userRewards) {
                      saveUserRewards(rewardsWithHistory)
                    }

                    // 显示奖励通知
                    setRewardNotification({
                      show: true,
                      points: updatedRewards.pointsAdded,
                      message: updatedRewards.action,
                      levelUp: updatedRewards.leveledUp,
                      newLevel: updatedRewards.newLevel ? updatedRewards.newLevel : undefined,
                    })

                    setShowCompleteModal(false)
                    router.push("/square")
                  }}
                  className="flex items-center justify-center mt-2 text-[#8BAF92]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  分享成果
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {rewardNotification && (
        <RewardNotification
          show={rewardNotification.show}
          points={rewardNotification.points}
          message={rewardNotification.message}
          levelUp={rewardNotification.levelUp}
          newLevel={rewardNotification.newLevel}
          onClose={() => setRewardNotification(null)}
        />
      )}
    </div>
  )
}

