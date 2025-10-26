import { useState, useEffect } from "react";
import { TaskType, TaskInfo, createTask, getTask, getHostGeo } from "../../api";
import { subscribeTaskSSE } from "../../api/sse";
import Header from "../../components/Header";
import ResultRenderer from "../../components/ResultRenderer";
import SearchInput from "../../components/SearchInput";
import Tabs from "../../components/Tabs";
import { TabWrapper } from "../../components/TabWrapper";
import '../../global.css';
import TabDescription from "../../components/TabDescription";
import Info from "../../components/Info";
import { HostGeo } from "../../types";

const tabList = [
  { label: "info", type: "info" as TaskType },
  { label: "HTTP(S)", type: "http-check" as TaskType },
  { label: "ping", type: "ping" as TaskType },
  { label: "TCP connect", type: "tcp-check" as TaskType },
  { label: "traceroute", type: "traceroute" as TaskType },
  { label: "DNS lookup", type: "dns-lookup" as TaskType },
];

const MainPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [taskResult, setTaskResult] = useState<{ [key: string]: TaskInfo } | null>(null);
  const [hostGeo, setHostGeo] = useState<HostGeo | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTaskSSE(
      (rawData, event) => {
        if (event === "agent-completed") {
          const updatedAgent = rawData as {
            taskId: string;
            agentId: string;
            result: any;
            type: TaskType;
          };

          setTaskResult(prev => {
            const prevTask = prev?.[updatedAgent.taskId];
            if (!prevTask) return prev;

            const agents = prevTask.tasksToAgents.map(agent =>
              agent.agentId !== updatedAgent.agentId
                ? agent
                : { ...agent, result: updatedAgent.result, status: "completed" }
            );

            return {
              ...prev,
              [updatedAgent.taskId]: { ...prevTask, tasksToAgents: agents },
            };
          });
        }
      },
      err => console.error("SSE error:", err)
    );

    return () => unsubscribe();
  }, []);

  const fetchHostGeo = async () => {
    if (!inputValue) return;
    setLoading(true);
    setHostGeo(null);

    try {
      const geo = await getHostGeo(inputValue);
      setHostGeo(geo);
    } catch (err) {
      console.error(err);
      setHostGeo(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskByType = async () => {
    if (!inputValue) return;
    setLoading(true);
    setTaskResult(null);

    try {
      const { id } = await createTask({ url: inputValue, type: tabList[activeTab].type });
      const initialResult = await getTask(id);

      setTaskResult({
        [id]: { ...initialResult, tasksToAgents: initialResult.tasksToAgents || [] },
      });
    } catch (err) {
      console.error(err);
      setTaskResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = () => {
    setSubmitted(true);
    if (tabList[activeTab].label === "info") {
      fetchHostGeo();
    } else {
      fetchTaskByType();
    }
  };

  useEffect(() => {
    if (!submitted || !inputValue) return;

    if (tabList[activeTab].label === "info") {
      fetchHostGeo();
    } else {
      fetchTaskByType();
    }
  }, [activeTab]);

  return (
    <div className="max-w-[1364px] w-full p-2.5 my-0 mx-auto">
      <div className="flex flex-col gap-[19px]">
        <Header />
        <SearchInput value={inputValue} onChange={setInputValue} onEnter={handleEnter} />

        <Tabs
          activeIndex={activeTab}
          onTabChange={index => setActiveTab(index)}
          tabs={tabList.map(tab => ({
            label: tab.label,
            content:
              tab.label === "info" ? (
                <Info taskResult={hostGeo ? [hostGeo] : []} />
              ) : (
                <TabWrapper title={tab.label}>
                  {loading ? (
                    <div className="flex justify-center items-center gap-2 py-8">
                      <span className="w-4 h-4 bg-[#FF375F] rounded-full animate-bounce"></span>
                      <span className="w-4 h-4 bg-[#FF375F] rounded-full animate-bounce200"></span>
                      <span className="w-4 h-4 bg-[#FF375F] rounded-full animate-bounce400"></span>
                    </div>
                  ) : taskResult ? (
                    <ResultRenderer type={tab.type} taskResult={Object.values(taskResult)[0]} />
                  ) : (
                    <TabDescription type={tab.type} />
                  )}
                </TabWrapper>
              ),
          }))}
        />
      </div>
    </div>
  );
};

export default MainPage;
