import React from "react";
import AddAgentModal from "../AddAgentModal";
import Modal from "../Modal";

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (key: string, vpsIp: string, vpsUser: string) => void;
  isSuccessOpen: boolean;
  onSuccessClose: () => void;
}

const AgentModal: React.FC<AgentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSuccessOpen,
  onSuccessClose,
}) => {
  return (
    <>
      <AddAgentModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />

      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose}>
        <div className="p-6 flex flex-col items-center gap-4">
          <p className="text-white text-lg">Агент успешно добавлен!</p>
          <button
            onClick={onSuccessClose}
            className="px-4 py-2 bg-[#FF375F] text-white rounded hover:bg-[#e02f53] transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AgentModal;
