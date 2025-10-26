import { HostGeo } from "../types";

export type TaskType =
    | "http-check"
    | "ping"
    | "tcp-check"
    | "dns-lookup"
    | "traceroute"
    | "info"

const BASE_URL = "/api";

export interface CreateTaskBody {
    url: string;
    type: TaskType;
}

export interface CreateTaskResponse {
    id: string;
}

export interface TaskInfo {
    id: string;
    type: string;
    input: string;
    createdAt: string;
    tasksToAgents: {
        taskId: string;
        agentId: string;
        status: string;
        result: any;
        createdAt: string;
        agent: {
            id: string;
            ip: string;
            location: string;
            webhookUrl: string;
            status: string;
            createdAt: string;
            lastSeenAt: string;
        };
    }[];
}

export const createTask = async (body: CreateTaskBody): Promise<CreateTaskResponse> => {
    const res = await fetch(`${BASE_URL}/core/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
    return res.json();
};

export const getTask = async (id: string): Promise<TaskInfo> => {
    const res = await fetch(`${BASE_URL}/core/task/${id}`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to get task: ${res.status}`);
    return res.json();
};

export const getHostGeo = async (host: string): Promise<HostGeo> => {
    const res = await fetch(`${BASE_URL}/core/host-geo?host=${encodeURIComponent(host)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to get host geo: ${res.status}`);
    return res.json();
};

export const getAgentList = async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/agent/list`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to get agent list: ${res.status}`);
    return res.json();
};

export const getTaskListByAgent = async (agentId: string): Promise<TaskInfo[]> => {
    const res = await fetch(`${BASE_URL}/core/task/list?agentId=${encodeURIComponent(agentId)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to get task list for agent ${agentId}: ${res.status}`);
    return res.json();
};


export const adminLogin = async (body: { login: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to login: ${res.status}`);
    }

    return true;
};

export const deployAgent = async (body: { ip: string; user: string }): Promise<any> => {
    const res = await fetch(`${BASE_URL}/admin/deploy-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include"
    });

    if (!res.ok) throw new Error(`Failed to deploy agent: ${res.status}`);

    return res;
};

export const getSshKey = async (): Promise<string> => {
    const res = await fetch(`${BASE_URL}/admin/ssh-key`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to get SSH key: ${res.status}`);

    const data = await res.json();
    return data.key;
};
