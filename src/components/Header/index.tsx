import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.svg'

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-12 flex justify-between items-center">
      <button
        onClick={() => navigate("/resolver")}
        className="px-3 py-1 border border-[#1C202A] rounded-[15px] bg-transparent text-gray-200 text-sm"
      >
        resolver
      </button>

      <img
        src={logo}
        alt="logo"
        className="sm:w-[150px] w-[120px]"
      />

      <button
        onClick={() => navigate("/agents")}
        className="px-3 py-1 border border-[#1C202A] rounded-[15px] bg-transparent text-gray-200 text-sm"
      >
        agents
      </button>
    </div>
  );
};

export default Header;
