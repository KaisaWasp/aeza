export type HttpResult = {
  id: string;
  type: "http-check";
  input: string;
  createdAt: string; 
  tasksToAgents: HttpTaskToAgent[];
};

export type HttpTaskToAgent = {
  taskId: string;
  agentId: string;
  status: "in_progress" | "completed" | "failed";
  result: HttpCheckResult | null;
  createdAt: string;
  agent: HttpAgent;
};

export type HttpCheckResult = {
  ip: string;
  status: string;
  headers: Record<string, string>;
  responseTime: string;
};

export type HttpAgent = {
  id: string;
  ip: string;
  location: string;
  webhookUrl: string;
  status: "online" | "offline" | "unknown";
  createdAt: string;
  lastSeenAt: string;
};
