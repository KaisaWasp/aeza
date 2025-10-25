import { useState, useEffect } from 'react';
import SearchInput from './components/SearchInput';
import { TabWrapper } from './components/TabWrapper';
import Tabs from './components/Tabs';
import './global.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { createTask, getTask, TaskType } from './api';
import { subscribeTaskSSE } from './api/sse';
import ResultRenderer from './components/ResultRenderer';

const tabList = [
  { label: 'info', type: 'http-check' as TaskType },
  { label: 'HTTP(S)', type: 'http-check' as TaskType },
  { label: 'ping', type: 'ping' as TaskType },
  { label: 'TCP connect', type: 'tcp-check' as TaskType },
  { label: 'traceroute', type: 'traceroute' as TaskType },
  { label: 'DNS lookup', type: 'dns-lookup' as TaskType },
];

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [taskResult, setTaskResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTaskSSE(
      (rawData, event) => {
        if (event === 'agent-completed') {
          const updatedAgent = rawData;
          setTaskResult(prev => {
            const agents = prevTask.tasksToAgents.map(agent => {
              if (agent.agentId !== updatedAgent.agentId) return agent;
              return { ...agent, ...updatedAgent }; // перезаписываем только поля пришедшего SSE
            });

            return {
              ...prev,
              [updatedAgent.taskId]: { ...prevTask, tasksToAgents: agents }
            };
          });
        }
      },
      (err) => console.error('SSE error:', err)
    );

    return () => unsubscribe();
  }, []);

  console.log(taskResult)

  const fetchTask = async () => {
    if (!inputValue) return;
    setLoading(true);
    setTaskResult(null);

    try {
      const { id } = await createTask({ url: inputValue, type: tabList[activeTab].type });
      const initialResult = await getTask(id);

      // Добавляем начальное состояние задачи
      setTaskResult({ [id]: { ...initialResult, tasksToAgents: initialResult.tasksToAgents || [] } });
    } catch (err) {
      console.error(err);
      setTaskResult({ error: 'Ошибка запроса' });
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = () => {
    setSubmitted(true);
    fetchTask();
  };

  useEffect(() => {
    if (submitted && inputValue) fetchTask();
  }, [activeTab]);

  return (
    <div className="max-w-[1364px] w-full p-2.5 my-0 mx-auto">
      <div className="flex flex-col gap-[19px]">
        <SearchInput value={inputValue} onChange={setInputValue} onEnter={handleEnter} />

        <Tabs
          activeIndex={activeTab}
          onTabChange={(index) => setActiveTab(index)}
          tabs={tabList.map((tab) => ({
            label: tab.label,
            content: (
              <TabWrapper title={tab.label}>
                {loading ? (
                  <div className="flex justify-center items-center gap-2 py-8">
                    <span className="w-4 h-4 bg-[#FF375F] rounded-full animate-bounce"></span>
                    <span className="w-4 h-4 bg-[#FF375F] rounded-full animate-bounce200"></span>
                    <span className="w-4 h-4 bg-[#FF375F] rounded-full animate-bounce400"></span>
                  </div>
                ) : taskResult ? (
                  <ResultRenderer
                    type={tab.type}
                    taskResult={Object.values(taskResult)[0]}
                  />
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    Введите адрес и нажмите <span className="text-[#FF375F]">Enter</span>
                  </div>
                )}
              </TabWrapper>
            ),
          }))}
        />
      </div>
    </div>
  );
};

export default App;
