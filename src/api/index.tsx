// api/tasks.ts
export type TaskType =
    | "http-check"
    | "ping"
    | "tcp-check"
    | "dns-lookup"
    | "traceroute";

const BASE_URL = "/api/task";

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

export async function createTask(
    body: CreateTaskBody
): Promise<CreateTaskResponse> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
    return res.json();
}

export async function getTask(id: string): Promise<TaskInfo> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to get task: ${res.status}`);
    return res.json();
}
