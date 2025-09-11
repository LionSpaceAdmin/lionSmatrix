export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-green-400 mb-4">
        Lions of Zion - Test Page
      </h1>
      <p className="text-xl mb-4">
        If you can see this page, the basic server is working.
      </p>
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold text-cyan-400">Matrix Status</h2>
          <p className="text-green-400">● Active</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold text-cyan-400">CSS Status</h2>
          <p className="text-green-400">● Loaded</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold text-cyan-400">Components</h2>
          <p className="text-yellow-400">⚠ Testing</p>
        </div>
      </div>
      
      {/* Simple matrix-like animation */}
      <div className="mt-8 relative h-64 bg-gray-900 rounded overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-full bg-green-400 animate-pulse"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 p-4 text-center">
          <h3 className="text-2xl font-mono text-green-400">MATRIX SIMULATION</h3>
          <p className="text-sm text-gray-400 mt-2">Basic visualization test</p>
        </div>
      </div>
    </div>
  )
}