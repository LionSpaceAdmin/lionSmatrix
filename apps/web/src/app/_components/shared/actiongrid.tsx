import { GridShell, GridItem } from '@lionspace/ui';

interface Action {
  id: string;
  icon?: string;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ActionGridProps {
  actions: Action[];
  cols?: 2 | 3 | 4;
}

export function ActionGrid({ actions, cols = 3 }: ActionGridProps) {
  const gridColsClass = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-4' : 'grid-cols-3';
  return (
    <GridShell className={`${gridColsClass} gap-4`}>
      {actions.map((action) => (
        <GridItem
          key={action.id}
          className={`cursor-pointer ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-transform`}
          onClick={!action.disabled ? action.onClick : undefined}
        >
          <div className="p-4">
            {action.icon && (
              <div className="text-3xl mb-3">{action.icon}</div>
            )}
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              {action.title}
            </h3>
            <p className="text-sm text-green-400/60">
              {action.description}
            </p>
          </div>
        </GridItem>
      ))}
    </GridShell>
  );
}