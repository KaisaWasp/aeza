export function subscribeTaskSSE(
  onMessage: (data: any, eventType: string) => void,
  onError?: (err: any) => void
) {
  const url = `/api/core/task/stream`;
  const eventSource = new EventSource(url);

  eventSource.addEventListener('agent-initialized', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data, 'agent-initialized');
    } catch (err) {
      console.error("SSE parse error", err);
    }
  });

  eventSource.addEventListener('agent-completed', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data, 'agent-completed');
    } catch (err) {
      console.error("SSE parse error", err);
    }
  });

  eventSource.onerror = (err) => {
    if (onError) onError(err);
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}
