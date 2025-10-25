import React, { useState } from "react";
import { HttpResult as HttpResultType, HttpTaskToAgent } from "../../types/index";
import Modal from "../Modal";

interface HttpResultProps {
  taskResult: HttpResultType;
}

const parseSetCookie = (cookieHeader: string): string[] => {
  if (!cookieHeader) return [];
  return cookieHeader.split(/,(?=\s*[A-Za-z0-9_\-]+=)/).map((c) => c.trim());
};

const HttpResult: React.FC<HttpResultProps> = ({ taskResult }) => {
  const [open, setOpen] = useState(false);
  const [headers, setHeaders] = useState<Record<string, string | string[]> | null>(null);

  if (!taskResult || !taskResult.tasksToAgents?.length) return null;

  const handleOpenHeaders = (task: HttpTaskToAgent) => {
    if (task.result?.headers) {
      const parsedHeaders: Record<string, string | string[]> = { ...task.result.headers };

      if (parsedHeaders["set-cookie"] && typeof parsedHeaders["set-cookie"] === "string") {
        parsedHeaders["set-cookie"] = parseSetCookie(parsedHeaders["set-cookie"]);
      }

      setHeaders(parsedHeaders);
      setOpen(true);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-[#1C202A]">
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Location</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Status</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Time</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Code</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Headers</th>
            <th className="py-2 px-3 text-[#FF375F]">IP</th>
          </tr>
        </thead>
        <tbody>
          {taskResult.tasksToAgents.map((task: HttpTaskToAgent, index: number) => (
            <tr
              key={task.agentId}
              className={`group cursor-pointer even:bg-[#1C202A] ${index !== taskResult.tasksToAgents.length - 1 ? "border-b-2 border-[#1C202A]" : ""
                }`}
            >
              <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                {task.agent?.location || "-"}
              </td>
              <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                {task.status}
              </td>
              <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                {task.result?.responseTime || "-"}
              </td>
              <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                {task.result?.status || "-"}
              </td>
              <td
                className="py-2 px-3 border-r-2 border-[#1C202A] text-[#FF375F] hover:text-white transition-colors cursor-pointer"
                onClick={() => handleOpenHeaders(task)}
              >
                {task.result?.headers ? "click" : "-"}
              </td>
              <td className="py-2 px-3 group-hover:text-[#FF375F] transition-colors">
                {task.result?.ip || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h3 className="text-[#FF375F] mb-3 text-lg font-semibold">Response Headers</h3>
        {headers ? (
          <table className="w-full border-collapse text-left text-white">
            <tbody>
              {Object.entries(headers).map(([key, value]) => (
                <tr key={key} className="border-b border-[#1C202A]">
                  <td className="py-1 px-2 text-[#FF375F] w-1/3 align-top">{key}</td>
                  <td className="py-1 px-2 break-all">
                    {Array.isArray(value) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {value.map((v, i) => (
                          <li key={i} className="text-gray-300">{v}</li>
                        ))}
                      </ul>
                    ) : (
                      value
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No headers found.</p>
        )}
      </Modal>
    </div>
  );
};

export default HttpResult;
