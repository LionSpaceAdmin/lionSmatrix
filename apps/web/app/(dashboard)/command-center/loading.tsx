export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] text-white">
      <div className="space-y-4 text-center">
        <div className="animate-pulse font-mono text-xl text-cyan-400">Initializing Command Center...</div>
        <div className="flex justify-center space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "0.1s" }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <div className="font-mono text-sm text-cyan-400/60">Loading AI systems and neural networks...</div>
      </div>
    </div>
  )
}
