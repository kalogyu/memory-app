export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  try {
    const user = localStorage.getItem("user")
    return !!user
  } catch {
    return false
  }
}

// 获取当前用户信息
export const getCurrentUser = (): { name: string; email: string } | null => {
  if (typeof window === "undefined") return null

  try {
    const userJson = localStorage.getItem("user")
    if (!userJson) return null

    return JSON.parse(userJson)
  } catch {
    return null
  }
}

// 登录用户
export const loginUser = (email: string, name: string): void => {
  if (typeof window === "undefined") return

  localStorage.setItem("user", JSON.stringify({ email, name }))
}

// 注销用户
export const logoutUser = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("user")
}

