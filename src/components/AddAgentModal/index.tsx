import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { getSshKey, deployAgent } from "../../api";
import DeployAgentModal from "../DeployAgentModal";

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (key: string, vpsIp: string, vpsUser: string) => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [key, setKey] = useState("");
  const [vpsIp, setVpsIp] = useState("");
  const [vpsUser, setVpsUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getSshKey()
      .then(setKey)
      .catch(err => console.error("Ошибка при получении SSH ключа:", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(key);
      alert("Ключ скопирован");
    } catch {
      alert("Не удалось скопировать ключ");
    }
  };

  const handleSubmit = async () => {
    if (!vpsIp || !vpsUser) {
      alert("Пожалуйста, заполните IP и пользователя");
      return;
    }

    setLoading(true);
    try {
      await deployAgent({ ip: vpsIp, user: vpsUser });
      setDeploySuccess(true);
      onSubmit?.(key, vpsIp, vpsUser);
      setDeployModalOpen(true);
      onClose();
    } catch (err: any) {
      alert(`Ошибка при деплое агента: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <p className="text-white text-sm sm:text-base">
            Добавьте данный ключ в файл{" "}
            <code className="bg-[#1C202A] px-1 rounded">authorized_keys</code>
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={loading ? "Загрузка SSH ключа..." : key}
              readOnly
              className="flex-1 p-3 rounded-[15px] bg-[#1C202A] border border-[#262626] text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              disabled={!key || loading}
              className="px-4 py-3 rounded-[15px] border border-[#FF375F] text-white font-semibold hover:bg-[#e02f53] transition-colors disabled:opacity-50"
            >
              Copy
            </button>
          </div>

          <p className="text-white text-sm sm:text-base">Введите данные вашей VPS</p>

          <input
            type="text"
            placeholder="IP address"
            value={vpsIp}
            onChange={(e) => setVpsIp(e.target.value)}
            className="w-full p-3 rounded-[15px] bg-[#1C202A] border border-[#262626] text-white placeholder-gray-400 focus:outline-none focus:border-[#FF375F]"
          />

          <input
            type="text"
            placeholder="User"
            value={vpsUser}
            onChange={(e) => setVpsUser(e.target.value)}
            className="w-full p-3 rounded-[15px] bg-[#1C202A] border border-[#262626] text-white placeholder-gray-400 focus:outline-none focus:border-[#FF375F]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-[15px] bg-[#FF375F] text-white font-semibold border border-[#FF375F] hover:bg-[#e02f53] hover:border-[#e02f53] transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </Modal>

      <DeployAgentModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        vpsIp={vpsIp}
        deploySuccess={deploySuccess}
      />
    </>
  );
};

export default AddAgentModal;
