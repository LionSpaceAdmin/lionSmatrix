'use client';

import { GridShell, GridItem, Card, CardHeader, CardTitle, CardContent } from '@lionspace/ui';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Intelligence Dashboard</h1>
          <p className="text-green-400/60">Real-time narrative analysis and threat monitoring</p>
        </header>

        <GridShell className="grid-cols-1 md:grid-cols-3 gap-6">
          <GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Active Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">247</div>
                <p className="text-green-400/60 text-sm">+12% from yesterday</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Narratives Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,842</div>
                <p className="text-green-400/60 text-sm">Across 47 sources</p>
              </CardContent>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Truth Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">87%</div>
                <p className="text-green-400/60 text-sm">Global accuracy rate</p>
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
                    <span>New narrative detected: Climate misinformation campaign</span>
                    <span className="text-green-400/60">2 min ago</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-green-400/20">
                    <span>Verification complete: Economic data manipulation</span>
                    <span className="text-green-400/60">15 min ago</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Alert: Coordinated bot network identified</span>
                    <span className="text-green-400/60">1 hour ago</span>
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