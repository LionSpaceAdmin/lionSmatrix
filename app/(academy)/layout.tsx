export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <nav className="border-b border-terminal-border p-4">
        <h1 className="text-xl font-bold text-terminal-cyan">LIONSPACE ACADEMY</h1>
      </nav>
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  )
}
