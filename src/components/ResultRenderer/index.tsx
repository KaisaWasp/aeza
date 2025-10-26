import React from 'react';
import HttpResult from '../HttpResult';
import PingResult from '../PingResult';
import TcpResult from '../TcpResult';
import DnsResult from '../DnsResult';
import TracerResult from '../TracerouteRsult';

interface ResultRendererProps {
  type: string;
  taskResult: any;
}

const ResultRenderer: React.FC<ResultRendererProps> = ({ type, taskResult }) => {
  switch (type) {
    case 'http-check':
      return <HttpResult taskResult={taskResult} />;

    case 'ping':
      return <PingResult taskResult={taskResult} />;

    case 'tcp-check':
      return <TcpResult taskResult={taskResult} />;

    case 'dns-lookup':
      return <DnsResult taskResult={taskResult} />;

    case 'traceroute':
      return <TracerResult taskResult={taskResult} />;

    default:
      return (
        <div className="text-gray-400">
          Нет визуализатора для типа <span className="text-[#FF375F]">{type}</span>
        </div>
      );
  }
};

export default ResultRenderer;
