'use client'

import { useState, useEffect, useCallback } from 'react'
import supabase from '../lib/supabase'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chatId, setChatId] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchOrCreateChat()
    }
  }, [user, fetchOrCreateChat])

  const fetchOrCreateChat = useCallback(async () => {
    try {
      // ユーザーの最新のチャットを取得
      let { data, error } = await supabase
        .from('chats')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      if (data.length === 0) {
        // チャットが存在しない場合、新規作成
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({ user_id: user.id, title: 'New Chat' })
          .select()
        if (createError) throw createError
        setChatId(newChat[0].id)
      } else {
        setChatId(data[0].id)
      }

      // チャットのメッセージを取得
      fetchMessages(data[0]?.id || newChat[0].id)
    } catch (error) {
      console.error('Error fetching or creating chat:', error)
    }
  }, [user])

  const fetchMessages = async (chatId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
    if (error) console.error('Error fetching messages:', error)
    else setMessages(data)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading || !chatId) return

    setIsLoading(true)

    try {
      // ユーザーメッセージの保存
      const { data: userData, error: userError } = await supabase
        .from('messages')
        .insert({ content: newMessage, role: 'user', chat_id: chatId })
        .select()

      if (userError) throw userError

      setMessages(prevMessages => [...prevMessages, userData[0]])
      setNewMessage('')

      // AIレスポンスの生成
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userData[0]].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate AI response')
      }

      const { response: aiResponse } = await response.json()

      // AIメッセージの保存
      const { data: aiData, error: aiError } = await supabase
        .from('messages')
        .insert({ content: aiResponse, role: 'assistant', chat_id: chatId })
        .select()

      if (aiError) throw aiError

      setMessages(prevMessages => [...prevMessages, aiData[0]])
    } catch (error) {
      console.error('Error in chat process:', error)
      alert('An error occurred while processing your message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !chatId) return <div>Loading...</div>

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg ${
              message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            } max-w-[70%]`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isLoading || !chatId}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}