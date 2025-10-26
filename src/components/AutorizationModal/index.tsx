import React, { useState } from "react";
import Modal from "../Modal";

interface AutorizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AutorizationModal: React.FC<AutorizationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Неверный логин или пароль");
      }

      sessionStorage.setItem("isAdmin", "true");

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-[#FF375F] mb-3 text-lg font-semibold text-center">Авторизация</h3>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-3 rounded-[15px] bg-[#1C202A] border border-[#262626] text-white placeholder-gray-400 focus:outline-none focus:border-[#FF375F]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-[15px] bg-[#1C202A] border border-[#262626] text-white placeholder-gray-400 focus:outline-none focus:border-[#FF375F]"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-[15px] bg-[#FF375F] text-white font-semibold border border-[#FF375F] hover:bg-[#e02f53] hover:border-[#e02f53] transition-colors disabled:opacity-50"
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </div>
    </Modal>
  );
};

export default AutorizationModal;
