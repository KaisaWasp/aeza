export function subscribeDeployAgentSSE(
  ip: string,
  onMessage: (data: string, eventType: string) => void,
  onError?: (err: any) => void
) {
  const url = `/api/admin/deploy-agent/stream?ip=${encodeURIComponent(ip)}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event: MessageEvent) => {
    const data = event.data || "";
    if (!data.trim()) return;
    onMessage(data, "info");
  };

  eventSource.onerror = (err) => {
    if (onError) onError(err);
    eventSource.close();
  };

  return () => eventSource.close();
}
