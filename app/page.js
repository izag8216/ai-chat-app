import Auth from './components/Auth'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to ItomaruGPT www</h1>
      <p className="text-xl mb-8">Your intelligent conversation partner</p>
      <Auth />
    </main>
  )
}