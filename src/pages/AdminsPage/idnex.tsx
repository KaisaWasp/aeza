import { useEffect, useState } from "react";
import AgentCard from "../../components/AgentCard";
import Header from "../../components/Header";
import { getAgentList } from "../../api";
import '../../global.css';

interface Agent {
  id: string;
  ip: string;
  location: string;
  status: string;
  lastSeen: string;
}

const AdminsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const list = await getAgentList();
        setAgents(list);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="w-full p-2.5 my-0 mx-auto">
      <div className="flex flex-col gap-[19px]">
        <Header />

        <div className="p-3.5 bg-[#1C202A]">
          <div className="p-3.5 min-h-[400px] flex flex-wrap gap-[10px]">
            {loading ? (
              <p className="text-gray-400">Loading agents...</p>
            ) : (
              agents.map((agent, index) => (
                <AgentCard
                  key={index}
                  id={agent.id}
                  city={agent.location}
                  ip={agent.ip}
                  isOnline={agent.status === "online"}
                  status={agent.status}
                  lastSeen={agent.lastSeen}
                  isAdmin={sessionStorage.getItem("isAdmin") === "true"}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminsPage;
