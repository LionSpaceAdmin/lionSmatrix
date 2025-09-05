import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/grid';

interface NarrativeCardProps {
  title: string;
  source: string;
  truthScore: number;
  timestamp: string;
  summary: string;
  tags?: string[];
}

export function NarrativeCard({ 
  title, 
  source, 
  truthScore, 
  timestamp, 
  summary, 
  tags = [] 
}: NarrativeCardProps) {
  const scoreColor = truthScore > 70 ? 'text-green-400' : 
                     truthScore > 40 ? 'text-yellow-400' : 
                     'text-red-400';

  return (
    <Card className="hover:border-green-400/50 transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{source} • {timestamp}</CardDescription>
          </div>
          <div className={`text-2xl font-bold ${scoreColor}`}>
            {truthScore}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-green-400/70 mb-3">{summary}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs border border-green-400/30 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}