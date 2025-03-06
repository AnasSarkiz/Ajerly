"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const Profile = () => {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/auth/verify", { credentials: "include" })

      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        router.push("/signin") // Redirect if not authenticated
      }
    }

    fetchProfile()
  }, [])

  if (!user) return <p>Loading...</p>

  return <h1>Welcome, {user.username}!</h1>
}

export default Profile
