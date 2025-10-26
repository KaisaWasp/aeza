import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { subscribeDeployAgentSSE } from "../../api/sse-deploy";

interface SSEEvent {
  type: string;
  message: string;
}

interface DeployAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vpsIp: string;
  deploySuccess: boolean;
}

const DeployAgentModal: React.FC<DeployAgentModalProps> = ({ isOpen, onClose, vpsIp }) => {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const eventsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !vpsIp) return;

    const unsubscribe = subscribeDeployAgentSSE(
      vpsIp,
      (data, eventType) => {
        const message = data.trim();
        if (!message) return;

        const type = message.includes("PLAY RECAP") ? "agent-completed" : eventType;

        setEvents(prev => [...prev, { type, message }]);
      },
      err => console.error("SSE error:", err)
    );


    return () => unsubscribe();
  }, [isOpen, vpsIp]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-lg font-semibold">Добавление агента</h2>
        <div className="max-h-64 overflow-y-auto bg-[#1C202A] p-3 rounded">
          {events.length === 0 && <p className="text-gray-400">Ожидание событий...</p>}
          {events.map((e, idx) => (
            <p
              key={idx}
              className={
                e.type === "error"
                  ? "text-red-500 text-sm"
                  : e.type === "agent-completed"
                    ? "text-green-400 text-sm"
                    : "text-white text-sm"
              }
            >
              [{e.type}] {e.message}
            </p>
          ))}
          <div ref={eventsEndRef} />
        </div>
      </div>
    </Modal>
  );
};

export default DeployAgentModal;
