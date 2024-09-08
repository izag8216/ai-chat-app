'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          AI Chat App
        </Link>
        <div>
          {user ? (
            <>
              <Link href="/chat" className="text-white mr-4">
                Chat
              </Link>
              <button onClick={handleSignOut} className="text-white">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/" className="text-white">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}