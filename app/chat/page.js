import Chat from '../components/Chat'

export default function ChatPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold p-4 bg-gray-100">ItomaruGPT</h1>
      <Chat />
    </main>
  )
}