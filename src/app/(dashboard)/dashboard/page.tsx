'use client';

import { GridShell, GridItem, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/grid';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text p-8 font-terminal">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-terminal-cyan terminal-glow">INTELLIGENCE DASHBOARD</h1>
          <p className="text-terminal-text/70 font-terminal">REAL-TIME NARRATIVE ANALYSIS AND THREAT MONITORING</p>
        </header>

        <GridShell className="grid-cols-1 md:grid-cols-3 gap-6">
          <GridItem>
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-terminal-cyan font-terminal">ACTIVE THREATS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-terminal-red terminal-glow-red">247</div>
                <p className="text-terminal-text/60 text-sm font-terminal">+12% FROM YESTERDAY</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem>
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-terminal-cyan font-terminal">NARRATIVES TRACKED</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-terminal-cyan terminal-glow">1,842</div>
                <p className="text-terminal-text/60 text-sm font-terminal">ACROSS 47 SOURCES</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem>
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-terminal-cyan font-terminal">TRUTH SCORE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-terminal-gold terminal-glow-gold">87%</div>
                <p className="text-terminal-text/60 text-sm font-terminal">GLOBAL ACCURACY RATE</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem className="col-span-full">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-terminal-cyan font-terminal">RECENT ACTIVITY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-terminal">
                  <div className="flex justify-between py-2 border-b border-terminal-border">
                    <span className="text-terminal-text">NEW NARRATIVE DETECTED: CLIMATE MISINFORMATION CAMPAIGN</span>
                    <span className="text-terminal-text/60">2 MIN AGO</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-terminal-border">
                    <span className="text-terminal-text">VERIFICATION COMPLETE: ECONOMIC DATA MANIPULATION</span>
                    <span className="text-terminal-text/60">15 MIN AGO</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-terminal-red">ALERT: COORDINATED BOT NETWORK IDENTIFIED</span>
                    <span className="text-terminal-text/60">1 HOUR AGO</span>
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