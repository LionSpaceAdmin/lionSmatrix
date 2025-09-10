interface AlertBannerProps {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  onClose?: () => void;
}

export function AlertBanner({ type, title, message, onClose }: AlertBannerProps) {
  const typeStyles = {
    info: 'bg-blue-500/10 border-blue-400 text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-400 text-yellow-400',
    error: 'bg-red-500/10 border-red-400 text-red-400',
    success: 'bg-green-500/10 border-green-400 text-green-400',
  };

  return (
    <div className={`relative border rounded-lg p-4 ${typeStyles[type]}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="opacity-80">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 hover:opacity-60 transition-opacity"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}