import * as React from 'react';
import { cn, generateMatrixCode } from '@/lib/utils';

interface MatrixBgProps extends React.HTMLAttributes<HTMLDivElement> {
  // You can add props here to customize the matrix effect, e.g., density, speed, color
}

const MatrixBg: React.FC<MatrixBgProps> = ({ className, ...props }) => {
  const [columns, setColumns] = React.useState<string[][]>([]);

  React.useEffect(() => {
    const calculateColumns = () => {
      const numColumns = Math.floor(window.innerWidth / 20); // 20px per column
      const newColumns = Array.from({ length: numColumns }, () =>
        generateMatrixCode(Math.floor(window.innerHeight / 20)).split('')
      );
      setColumns(newColumns);
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    return () => window.removeEventListener('resize', calculateColumns);
  }, []);

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden bg-black z-0', className)}
      {...props}
    >
      <div className="flex justify-around">
        {columns.map((column, i) => (
          <div
            key={i}
            className="text-terminal-green animate-matrix-rain opacity-0"
            style={{
              animationDuration: `${Math.random() * 5 + 2}s`,
              animationDelay: `${Math.random() * 5}s`,
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
            }}
          >
            {column.map((char, j) => (
              <span key={j}>{char}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

MatrixBg.displayName = 'MatrixBg';

export { MatrixBg };
