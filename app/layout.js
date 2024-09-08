import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'AI Chat App',
  description: 'Simple AI chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}