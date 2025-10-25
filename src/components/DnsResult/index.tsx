import React, { useState } from "react";
import Modal from "../Modal";

interface DnsResultProps {
  taskResult: any;
}

const DnsResult: React.FC<DnsResultProps> = ({ taskResult }) => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  if (!taskResult || !taskResult.tasksToAgents?.length) return null;

  const handleOpen = (task: any) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const renderRecord = (record: any) => {
    if (record.type === "A" || record.type === "AAAA") {
      return `${record.type}: ${record.address} (TTL: ${record.ttl})`;
    }
    if (record.type === "MX") {
      return `${record.type}: ${record.exchange} (priority: ${record.priority})`;
    }
    if (record.type === "NS") {
      return `${record.type}: ${record.value}`;
    }
    if (record.type === "TXT") {
      return record.entries?.map((e: string) => `${record.type}: ${e}`).join(", ");
    }
    if (record.type === "SOA") {
      return `${record.type}: ns=${record.nsname}, hostmaster=${record.hostmaster}, serial=${record.serial}, refresh=${record.refresh}, retry=${record.retry}, expire=${record.expire}, minttl=${record.minttl}`;
    }
    if (record.type === "CAA") {
      return `${record.type}: issue=${record.issue}, critical=${record.critical}`;
    }
    return JSON.stringify(record);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-[#1C202A]">
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Location</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Result</th>
            <th className="py-2 px-3 text-[#FF375F]">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {taskResult.tasksToAgents.map((task: any, index: number) => (
            <tr
              key={task.agentId}
              className={`group cursor-pointer even:bg-[#1C202A] ${
                index !== taskResult.tasksToAgents.length - 1 ? "border-b-2 border-[#1C202A]" : ""
              }`}
            >
              <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                {task.agent?.location || "-"}
              </td>
              <td
                className="py-2 px-3 border-r-2 border-[#1C202A] text-[#FF375F] hover:text-white transition-colors cursor-pointer"
                onClick={() => handleOpen(task)}
              >
                click
              </td>
              <td className="py-2 px-3 group-hover:text-[#FF375F] transition-colors">
                {task.agent?.ip || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модалка */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h3 className="text-[#FF375F] mb-3 text-lg font-semibold">
          DNS Result - {selectedTask?.agent?.location || ""}
        </h3>

        {selectedTask?.result?.result ? (
          <ul className="list-disc list-inside space-y-1 text-white">
            {selectedTask.result.result.map((record: any, idx: number) => (
              <li key={idx} className="break-all">
                {renderRecord(record)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No records found.</p>
        )}

        {selectedTask?.result?.responseTime && (
          <p className="mt-2 text-gray-400">Response Time: {selectedTask.result.responseTime}</p>
        )}
      </Modal>
    </div>
  );
};

export default DnsResult;
