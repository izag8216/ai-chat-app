import './globals.css'

export const metadata = {
  title: 'AI Chat App',
  description: 'Simple AI chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
