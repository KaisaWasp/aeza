import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import { getHostGeo, getTaskListByAgent } from "../../api";
import { HostGeo } from "../../types";
import '../../global.css';
import DarkMapExample from "../../components/MapWithPins";

interface Task {
  taskId: string;
  status: string;
  result?: {
    ip?: string;
    responseTime?: string;
  };
  task: {
    type: string;
    input: string;
  };
}

const HistoryPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("id");

  const { id } = useParams<{ id: string }>();
  const [geo, setGeo] = useState<HostGeo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agentId) return;

    const fetchGeo = async () => {
      setLoading(true);
      try {
        const data = await getHostGeo(agentId);
        setGeo(data);
      } catch (err) {
        console.error("Failed to fetch geo:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const data = await getTaskListByAgent(taskId || '');
        // @ts-ignore
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch task history:", err);
      }
    };

    fetchGeo();
    fetchTasks();
  }, [id]);

  if (loading || !geo) {
    return (
      <div className="w-full p-2.5 my-0 mx-auto">
        <Header />
        <p className="text-gray-400 mt-5">Loading agent info...</p>
      </div>
    );
  }

  const { location, ip } = geo;
  const hasCoordinates = location.latitude && location.longitude;

  return (
    <div className="w-full p-2.5 my-0 mx-auto">
      <div className="flex flex-col gap-[19px]">
        <Header />

        <div className="p-3.5 bg-[#1C202A] flex flex-col md:flex-row gap-3">
          <div className="p-6 gap-2.5 bg-[#030712] w-full md:w-[60%] rounded-[30px]">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-[#1C202A]">
                  <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">IP</td>
                  <td className="py-2 px-4 text-white">{ip}</td>
                </tr>
                <tr className="border-b border-[#1C202A]">
                  <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">City</td>
                  <td className="py-2 px-4 text-white">{location.city}</td>
                </tr>
                <tr className="border-b border-[#1C202A]">
                  <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">Country</td>
                  <td className="py-2 px-4 text-white">{location.country_name}</td>
                </tr>
                <tr className="border-b border-[#1C202A]">
                  <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">Zipcode</td>
                  <td className="py-2 px-4 text-white">{location.zipcode}</td>
                </tr>
                <tr className="border-[#1C202A]">
                  <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">EU Member</td>
                  <td className="py-2 px-4 text-white">{location.is_eu ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-6 gap-2.5 bg-[#030712] flex-1 rounded-[30px]">
            {hasCoordinates && (
              <DarkMapExample
                markers={[
                  {
                    id: 1,
                    position: [
                      parseFloat(location.latitude),
                      parseFloat(location.longitude),
                    ],
                    label: ip,
                  },
                ]}
                height={300}
              />
            )}
          </div>
        </div>

        <div className="border-2 border-[#1C202A] h-[45px] rounded-[30px] flex justify-center items-center text-[22px]">
          ИСТОРИЯ
        </div>

        <div className="p-3.5 bg-[#1C202A] rounded-[30px] overflow-x-auto">
          <div className="p-6 gap-2.5 bg-[#030712] flex-1 rounded-[30px] overflow-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-[#1C202A]">
                  <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Task ID</th>
                  <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Status</th>
                  <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">IP</th>
                  <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Response Time</th>
                  <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Type</th>
                  <th className="py-2 px-3 text-[#FF375F]">Input</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    key={task.taskId}
                    className={`even:bg-[#262830] ${index !== tasks.length - 1 ? "border-b-2 border-[#1C202A]" : ""}`}
                  >
                    <td className="py-2 px-3 border-r-2 border-[#1C202A]">{task.taskId}</td>
                    <td className="py-2 px-3 border-r-2 border-[#1C202A]">{task.status}</td>
                    <td className="py-2 px-3 border-r-2 border-[#1C202A]">{task.result?.ip || "-"}</td>
                    <td className="py-2 px-3 border-r-2 border-[#1C202A]">{task.result?.responseTime || "-"}</td>
                    <td className="py-2 px-3 border-r-2 border-[#1C202A]">{task.task.type}</td>
                    <td className="py-2 px-3">{task.task.input}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
