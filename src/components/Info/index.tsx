import React from "react";

interface InfoProps {
  taskResult?: any;
}

const Info: React.FC<InfoProps> = ({ taskResult }) => {
  const data = taskResult?.tasksToAgents || [
    { agentId: "1", agent: { location: "New York" } },
    { agentId: "2", agent: { location: "London" } },
    { agentId: "3", agent: { location: "Tokyo" } },
  ];

  return (
    <div className="flex gap-4">
      <div className="w-1/2 bg-gray-700 p-4 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-gray-600">
              <th className="py-2 px-3 text-gray-200 border-r-2 border-gray-600">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((task: any, index: number) => (
              <tr
                key={task.agentId}
                className={`even:bg-gray-600 ${
                  index !== data.length - 1 ? "border-b-2 border-gray-600" : ""
                }`}
              >
                <td className="py-2 px-3">{task.agent?.location || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Info;
