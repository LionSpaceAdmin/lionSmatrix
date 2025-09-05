'use client';

// Temporary local components until @lionspace/ui workspace is fixed
const GridShell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`grid ${className}`}>{children}</div>
);

const GridItem = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black/40 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-green-400 font-mono">{children}</h3>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="text-green-400">{children}</div>
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 font-mono text-green-400">Intelligence Dashboard</h1>
          <p className="text-green-400/60 font-mono">Real-time narrative analysis and threat monitoring</p>
        </header>

        <GridShell className="grid-cols-1 md:grid-cols-3 gap-6">
          <GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Active Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono">247</div>
                <p className="text-green-400/60 text-sm font-mono">+12% from yesterday</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Narratives Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono">1,842</div>
                <p className="text-green-400/60 text-sm font-mono">Across 47 sources</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Truth Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono">87%</div>
                <p className="text-green-400/60 text-sm font-mono">Global accuracy rate</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem className="col-span-full">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-green-400/20">
                    <span className="font-mono text-sm">New narrative detected: Climate misinformation campaign</span>
                    <span className="text-green-400/60 font-mono text-sm">2 min ago</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-green-400/20">
                    <span className="font-mono text-sm">Verification complete: Economic data manipulation</span>
                    <span className="text-green-400/60 font-mono text-sm">15 min ago</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-mono text-sm">Alert: Coordinated bot network identified</span>
                    <span className="text-green-400/60 font-mono text-sm">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GridItem>
        </GridShell>
      </div>
    </div>
  );
}