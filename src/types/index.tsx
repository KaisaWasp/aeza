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

export interface HostGeo {
  ip: string;
  location: {
    continent_code: string;
    continent_name: string;
    country_code2: string;
    country_code3: string;
    country_name: string;
    country_name_official: string;
    country_capital: string;
    state_prov: string;
    state_code: string;
    district: string;
    city: string;
    zipcode: string;
    latitude: string;
    longitude: string;
    is_eu: boolean;
    country_flag: string;
    geoname_id: string;
    country_emoji: string;
  };
  country_metadata: {
    calling_code: string;
    tld: string;
    languages: string[];
  };
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
}
