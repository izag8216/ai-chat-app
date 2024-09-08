'use client'

import { useState } from 'react'
import supabase from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the login link!')
    setLoading(false)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Logged in successfully!')
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form className="p-10 bg-white rounded-lg shadow-md">
        <h2 className="mb-5 text-2xl font-bold">Auth</h2>
        <input
          className="w-full p-2 mb-3 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full p-2 mb-3 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={handleSignUp}
          disabled={loading}
        >
          Sign Up
        </button>
        <button
          className="w-full p-2 mb-3 text-white bg-green-500 rounded hover:bg-green-600"
          onClick={handleSignIn}
          disabled={loading}
        >
          Sign In
        </button>
        {message && <p className="mt-3 text-sm text-center">{message}</p>}
      </form>
    </div>
  )
}