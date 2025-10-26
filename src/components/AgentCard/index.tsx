import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHostGeo } from "../../api";
import { HostGeo } from "../../types";
import DarkMapExample from "../../components/MapWithPins";

interface AgentCardProps {
  id?: string;
  city?: string;
  ip?: string;
  isOnline?: boolean;
  isAdmin?: boolean;
  status?: string;
  lastSeen?: string;
  onClick?: () => void;
}

const AgentCard: FC<AgentCardProps> = ({
  id,
  city = "Berlin",
  ip = "123.123.123",
  isOnline = false,
  isAdmin,
  status,
  lastSeen,
  onClick,
}) => {
  const navigate = useNavigate();
  const [geo, setGeo] = useState<HostGeo | null>(null);

  if (status === "created") return null;

  useEffect(() => {
    if (!ip) return;

    const fetchGeo = async () => {
      try {
        const data = await getHostGeo(ip);
        setGeo(data);
      } catch (err) {
        console.error("Failed to fetch geo:", err);
      }
    };

    fetchGeo();
  }, [ip]);

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleHistoryClick = () => {
    if (ip) {
      if (id) {
        navigate(`/history/${ip}?id=${id}`);
      } else {
        navigate(`/history/${ip}`);
      }
    } else {
      navigate("/history");
    }
  };

  if (isAdmin) {
    return (
      <div
        onClick={onClick}
        className="w-[410px] h-[520px] rounded-[30px] bg-[#030712] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="w-16 h-16 bg-[#1C202A] rounded-full flex items-center justify-center text-white text-3xl">
          +
        </div>
      </div>
    );
  }

  return (
    <div className="w-[410px] h-[520px] rounded-[30px] bg-[#030712] flex flex-col gap-[30px] pt-[35px] px-[34px] pb-[11px]">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-[22px] sm:text-[38px] text-white border-b-2 border-[#FF375F] inline-block">
            {city.split(" ").map((word, index) => (
              <span key={index}>
                {word}
                <br />
              </span>
            ))}
          </p>
          <p className="text-[#FF375F]">{ip}</p>
        </div>

        <div className="flex gap-4 items-center">
          <p className={isOnline ? "text-green-500" : "text-[#FF375F]"}>{isOnline ? 'online' : 'offline'}</p>
          <p className="text-[#FF375F]">{!isOnline && formatTime(lastSeen)}</p>
        </div>
      </div>

      <button
        onClick={handleHistoryClick}
        className="px-3 py-1 border border-[#1C202A] rounded-[15px] bg-transparent text-gray-200 text-sm"
      >
        История
      </button>

      {geo && geo.location.latitude && geo.location.longitude && (
        <DarkMapExample
          markers={[
            {
              id: 1,
              position: [parseFloat(geo.location.latitude), parseFloat(geo.location.longitude)],
              label: city,
            },
          ]}
        />
      )}
    </div>
  );
};

export default AgentCard;
