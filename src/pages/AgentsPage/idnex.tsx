import { useEffect, useState } from "react";
import AgentCard from "../../components/AgentCard";
import Header from "../../components/Header";
import AddAgentModal from "../../components/AddAgentModal";
import { getAgentList } from "../../api";
import '../../global.css';

interface Agent {
  id: string;
  ip: string;
  location: string;
  status: string;
  lastSeen: string;
}

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  const handleAddAgent = (key: string, vpsIp: string, vpsUser: string) => {
    console.log("Добавляем агента:", { key, vpsIp, vpsUser });
    setModalOpen(false);
  };

  return (
    <div className="w-full p-2.5 my-0 mx-auto">
      <div className="flex flex-col gap-[19px]">
        <Header />

        <div className="p-3.5 bg-[#1C202A]">
          <div className="p-3.5 min-h-[400px] flex flex-wrap gap-[10px]">
            {loading ? (
              <p className="text-gray-400">Loading agents...</p>
            ) : (
              <>
                {isAdmin && (
                  <AgentCard
                    isAdmin={true}
                    onClick={() => setModalOpen(true)}
                  />
                )}

                {agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    id={agent.id}
                    city={agent.location}
                    ip={agent.ip}
                    isOnline={agent.status === "online"}
                    status={agent.status}
                    lastSeen={agent.lastSeen}
                    isAdmin={false}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {isAdmin && (
        <AddAgentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddAgent}
        />
      )}
    </div>
  );
};

export default AgentsPage;
