import React, { useState } from "react";
import { getHostGeo, TaskInfo } from "../../api";
import Modal from "../Modal";
import DarkMapExample from "../MapWithPins";

interface TracerResultProps {
  taskResult: TaskInfo;
}

interface GeoResult {
  ip: string;
  country: string;
  city: string;
  flag: string;
  emoji: string;
  latitude: number;
  longitude: number;
}

interface MarkerType {
  id: number;
  position: [number, number];
  label: string;
}

const TracerResult: React.FC<TracerResultProps> = ({ taskResult }) => {
  const [openMapModal, setOpenMapModal] = useState(false);
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [mapMarkers, setMapMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!taskResult || !taskResult.tasksToAgents?.length) return null;

  const handleOpenMapModal = async (task: any) => {
    setSelectedTask(task);
    setMapMarkers([]);
    setError(null);
    setOpenMapModal(true);

    const resultArray = task.result?.result || [];
    if (!Array.isArray(resultArray) || !resultArray.length) return;

    setLoading(true);
    const results: GeoResult[] = [];

    for (const hop of resultArray) {
      const ips = Object.keys(hop);
      if (!ips.length) continue;

      const ip = ips[0];
      try {
        const res = await getHostGeo(ip);
        if (res?.location?.latitude && res?.location?.longitude) {
          results.push({
            ip,
            country: res.location.country_name,
            city: res.location.city,
            flag: res.location.country_flag,
            emoji: res.location.country_emoji,
            latitude: Number(res.location.latitude),
            longitude: Number(res.location.longitude),
          });
        }
      } catch {
        continue;
      }
    }

    const markers = results.map((point, idx) => ({
      id: idx + 1,
      position: [point.latitude, point.longitude] as [number, number],
      label: `${point.city || "-"}, ${point.country} ${point.emoji} (${point.ip})`,
    }));

    setMapMarkers(markers);
    setLoading(false);
  };

  const handleOpenInfoModal = (task: any) => {
    setSelectedTask(task);
    setOpenInfoModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-[#1C202A]">
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Location</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Result</th>
            <th className="py-2 px-3 text-[#FF375F] border-r-2 border-[#1C202A]">Info</th>
            <th className="py-2 px-3 text-[#FF375F]">Card</th>
          </tr>
        </thead>
        <tbody>
          {taskResult.tasksToAgents.map((task, index: number) => (
            <tr
              key={task.agentId}
              className={`group cursor-pointer even:bg-[#1C202A] ${index !== taskResult.tasksToAgents.length - 1
                ? "border-b-2 border-[#1C202A]"
                : ""
                }`}
            >
              <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                {task.agent?.location || "-"}
              </td>
              <td className="py-2 px-3 border-r-2 border-[#1C202A] group-hover:text-[#FF375F] transition-colors">
                {task.result?.status || task.status || "-"}
              </td>
              <td className="py-2 px-3 border-r-2 border-[#1C202A] text-[#FF375F] transition-colors">
                <button
                  className="px-3 py-1 bg-[#FF375F] text-[#FF375F] rounded hover:bg-[#FF6F87] transition-colors"
                  onClick={() => handleOpenInfoModal(task)}
                >
                  click
                </button>
              </td>
              <td className="py-2 px-3  text-[#FF375F] ">
                <button
                  className="px-3 py-1 bg-[#FF375F] text-[#FF375F] rounded hover:bg-[#FF6F87] transition-colors"
                  onClick={() => handleOpenMapModal(task)}
                >
                  click
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={openMapModal} onClose={() => setOpenMapModal(false)}>
        <h3 className="text-[#FF375F] mb-3 text-lg font-semibold">
          Traceroute Map – {selectedTask?.agent?.location || ""}
        </h3>

        {loading && <p className="text-gray-400">Loading geo info...</p>}

        {!loading && mapMarkers.length === 0 && (
          <p className="text-gray-400">No geo information found.</p>
        )}

        {!loading && mapMarkers.length > 0 && (
          <div style={{ height: "500px", width: "100%" }}>
            <DarkMapExample markers={mapMarkers} />
          </div>
        )}

        {error && <p className="text-red-400 mt-3">{error}</p>}
      </Modal>

      <Modal isOpen={openInfoModal} onClose={() => setOpenInfoModal(false)}>
        <h3 className="text-[#FF375F] mb-3 text-lg font-semibold">
          Result Details
        </h3>

        {selectedTask?.result?.result ? (
          <div className="max-h-[400px] overflow-y-auto text-sm text-gray-300 space-y-2">
            {selectedTask.result.result.map((entry: any, idx: number) => {
              const ip = Object.keys(entry)[0];
              const value = entry[ip];
              return (
                <div
                  key={idx}
                  className="flex justify-between border-b border-[#1C202A] py-1"
                >
                  <span className="text-[#FF375F] font-mono">{ip}</span>
                  <span>{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                </div>
              );
            })}
            {selectedTask.result.responseTime && (
              <div className="flex justify-between border-t border-[#1C202A] pt-2 mt-2 text-gray-400">
                <span>Response Time:</span>
                <span>{selectedTask.result.responseTime}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No result data available.</p>
        )}
      </Modal>
    </div>
  );
};

export default TracerResult;
