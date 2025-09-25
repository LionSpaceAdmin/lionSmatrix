type EventMap = {
  cta_click: {
    cta_name: string;
    location: string;
  };
  tool_opened: {
    tool_name: string;
  };
  // Add other events here
};

// This is a generic track function that is type-safe
export const track = <TEvent extends keyof EventMap>(
  event: TEvent,
  payload: EventMap[TEvent]
) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Telemetry]', event, payload);
  }
  // In production, this could send data to an analytics service.
  // For this mission, it's a no-op in production as per constraints.
};
