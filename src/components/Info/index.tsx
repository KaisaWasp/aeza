import React from "react";
import DarkMapExample from "../MapWithPins";
import { HostGeo } from "../../types";
import TabDescription from "../TabDescription";

interface MarkerType {
  id: number;
  position: [number, number];
  label: string;
}

interface InfoProps {
  taskResult?: HostGeo[];
}

const Info: React.FC<InfoProps> = ({ taskResult }) => {
  if (!taskResult || taskResult.length === 0) {

    return (
      <div className='flex flex-col gap-[19px]'>
        <div className='p-3.5 bg-[#1C202A]'>
          <div className='p-3.5 bg-[#030712] rounded-[30px] min-h-[400px]'>
            <TabDescription type="info" />
          </div>
        </div>
      </div>
    );
  }

  const host = taskResult[0];

  const hasCoordinates = host.location.latitude && host.location.longitude;

  const markers: MarkerType[] = hasCoordinates
    ? [
      {
        id: 1,
        position: [
          parseFloat(host.location.latitude),
          parseFloat(host.location.longitude),
        ],
        label: host.ip,
      },
    ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-[43px] rounded-[30px] bg-[#1C202A] flex justify-center items-center text-white font-semibold">
        Info
      </div>

      <div className="p-3.5 bg-[#1C202A] flex flex-col md:flex-row gap-4">
        <div className="p-6 gap-2.5 bg-[#030712] w-full md:w-[60%] rounded-[30px] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b border-[#1C202A]">
                <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">IP</td>
                <td className="py-2 px-4 text-white">{host.ip}</td>
              </tr>
              <tr className="border-b border-[#1C202A]">
                <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">City</td>
                <td className="py-2 px-4 text-white">{host.location.city}</td>
              </tr>
              <tr className="border-b border-[#1C202A]">
                <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">Country</td>
                <td className="py-2 px-4 text-white">{host.location.country_name}</td>
              </tr>
              <tr className="border-b border-[#1C202A]">
                <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">Zipcode</td>
                <td className="py-2 px-4 text-white">{host.location.zipcode}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 font-semibold text-gray-400 border-r-2 border-[#1C202A]">EU</td>
                <td className="py-2 px-4 text-white">{host.location.is_eu ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full md:w-[40%] bg-[#030712] p-4 rounded-[30px] h-[400px]">
          {markers.length > 0 && <DarkMapExample markers={markers} height={370} />}
        </div>
      </div>
    </div>
  );
};

export default Info;
