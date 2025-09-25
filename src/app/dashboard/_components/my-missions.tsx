import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const mockMissions = [
  { id: 1, title: 'Fact-Check: Viral Video', status: 'In Progress' },
  { id: 2, title: 'Research: New Disinfo Actor', status: 'Completed' },
  { id: 3, title: 'Campaign: Pre-bunking Health Myths', status: 'Planning' },
];

export function MyMissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Missions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockMissions.map((mission) => (
            <li key={mission.id} className="flex items-center justify-between">
              <span>{mission.title}</span>
              <span className="text-sm text-muted-foreground">{mission.status}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant="secondary" className="mt-4 w-full">
          <Link href="/dashboard/missions">View All Missions</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
