import React from "react";
import { TaskInfo } from "../../api";

interface PingResultProps {
    taskResult: TaskInfo;
}

const PingResult: React.FC<PingResultProps> = ({ taskResult }) => {
    if (!taskResult || !taskResult.tasksToAgents?.length) return null;

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b-2 border-[#1C202A]">
                        <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">
                            Location
                        </th>
                        <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">
                            Result
                        </th>
                        <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">
                            RTT min / avg / max
                        </th>
                        <th className="py-2 px-3 text-[#FF375F]">IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    {taskResult.tasksToAgents.map((task, index: number) => {
                        const result = task.result?.result;
                        const rtt = result
                            ? `${result.min} / ${result.avg} / ${result.max} ms`
                            : "-";

                        return (
                            <tr
                                key={task.agentId}
                                className={`group cursor-pointer even:bg-[#1C202A] ${
                                    index !==
                                    taskResult.tasksToAgents.length - 1
                                        ? "border-b-2 border-[#1C202A]"
                                        : ""
                                }`}
                            >
                                <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                                    {task.agent?.location || "-"}
                                </td>
                                <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                                    {task.result?.status || task.status || "-"}
                                </td>
                                <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                                    {rtt}
                                </td>
                                <td className="py-2 px-3 group-hover:text-[#FF375F] transition-colors">
                                    {task.agent?.ip || "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PingResult;
