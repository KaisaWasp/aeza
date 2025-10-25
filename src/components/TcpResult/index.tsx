interface TcpResultProps {
  taskResult: any;
}

const TcpResult: React.FC<TcpResultProps> = ({ taskResult }) => {
  if (!taskResult || !taskResult.tasksToAgents?.length) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-[#1C202A]">
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Location</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Result</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Time</th>
            <th className="py-2 px-3 text-[#FF375F]">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {taskResult.tasksToAgents.map((task: any, index: number) => (
            <tr
              key={task.agentId}
              className={`even:bg-[#1C202A] hover:text-[#FF375F] hover:cursor-pointer ${index !== taskResult.tasksToAgents.length - 1 ? 'border-b-2 border-[#1C202A]' : ''
                }`}
            >
              <td className="py-2 px-3 border-r-2 border-[#1C202A]">
                {task.agent?.location || '-'}
              </td>
              <td className="py-2 px-3 border-r-2 border-[#1C202A]">
                {task.result?.status || task.status || '-'}
              </td>
              <td className="py-2 px-3 border-r-2 border-[#1C202A]">
                {task.result?.responseTime || '-'}
              </td>
              <td className="py-2 px-3">
                {task.result?.ip || task.agent?.ip || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TcpResult;
